#!/bin/sh
set -euo pipefail

# `$key` is a reserved variable that make_auth_header uses for the request.
# Before calling the function make sure it is set to the AWS S3 key you want to download

function sha256Hash() {
    printf "$(echo $* | sed 's/%/%%/g')" | openssl dgst -sha256 -binary -hex | sed 's/^.* //'
}

function to_hex() {
    printf "$1" | od -A n -t x1 | tr -d [:space:]
}

function hmac_sha256() {
    printf "$2" | \
        openssl dgst -binary -hex -sha256 -mac HMAC -macopt hexkey:"$1" | \
        sed 's/^.* //'
}

## http://docs.aws.amazon.com/general/latest/gr/sigv4-create-canonical-request.html
function create_canonical_request() {
    local canonical_uri="/${key}"
    
    local canonical_headers="${header_host}\n${header_x_amz_content}\n${header_x_amz_date}"

    local request_payload=$(sha256Hash "") # Empty string still has a full hash
    
    if [ "${method}" = "PUT" ]; then
    	canonical_headers="${canonical_headers}\n${header_x_amz_storage_class}"
    	request_payload="UNSIGNED-PAYLOAD"
    fi

    printf "$(sha256Hash "${method}\n${canonical_uri}\n\n${canonical_headers}\n\n${signed_headers}\n${request_payload}")"
}

## http://docs.aws.amazon.com/general/latest/gr/sigv4-create-string-to-sign.html
function create_string_to_sign() {
	printf "AWS4-HMAC-SHA256\n${timestamp}\n${credential_scope}\n$(create_canonical_request)"
}


## http://docs.aws.amazon.com/general/latest/gr/sigv4-calculate-signature.html
function calculate_signature() {
	local secret=$(to_hex "AWS4${SECRET_KEY}")
	local k_date=$(hmac_sha256 "${secret}" "${today}")
	local k_region=$(hmac_sha256 "${k_date}" "${AWS_REGION_NAME}")
	local k_service=$(hmac_sha256 "${k_region}" "${AWS_SERVICE_NAME}")
	local k_signing=$(hmac_sha256 "${k_service}" "aws4_request")
	local string_to_sign="$(create_string_to_sign)"

	printf "$(echo "$(hmac_sha256 "${k_signing}" "${string_to_sign}" | sed 's/^.* //')")"
}

## http://docs.aws.amazon.com/general/latest/gr/sigv4-add-signature-to-request.html#sigv4-add-signature-auth-header
function make_auth_header() {
	local credential="Credential=${ACCESS_KEY}/${credential_scope}"
	local s_headers="SignedHeaders=${signed_headers}"
	local signature="Signature=$(calculate_signature)"

	printf "Authorization: AWS4-HMAC-SHA256 ${credential}, ${s_headers}, ${signature}"
}

# download_file <key> <filename>
function download_file() {
	key="$1"
	filename="$2"
	
	mkdir -p $(dirname $filename)

	api_url="https://${AWS_BUCKET_NAME}.${AWS_SERVICE_NAME}.${AWS_REGION_NAME}.amazonaws.com/$key"

	method="GET"

	timestamp=${timestamp-$(date -u +"%Y%m%dT%H%M%SZ")}
	today=${today-$(date -u +"%Y%m%d")}

	credential_scope="${today}/${AWS_REGION_NAME}/${AWS_SERVICE_NAME}/aws4_request"

	signed_headers="host;x-amz-content-sha256;x-amz-date"
	header_host="host:$(printf ${api_url} | awk -F/ '{print $3}')"
	header_x_amz_content="x-amz-content-sha256:$(sha256Hash "")"
	header_x_amz_date="x-amz-date:${timestamp}"

	# Download
	curl -o "$filename" -X "${method}" "${api_url}" -H "$(make_auth_header)" -H "${header_host}" -H "${header_x_amz_content}" -H "${header_x_amz_date}"
}

# upload_file <key> <filename>
function upload_file() {
	key="$1"
	filename="$2"

	api_url="https://${AWS_BUCKET_NAME}.${AWS_SERVICE_NAME}.${AWS_REGION_NAME}.amazonaws.com/$key"

	method="PUT"

	timestamp=${timestamp-$(date -u +"%Y%m%dT%H%M%SZ")}
	today=${today-$(date -u +"%Y%m%d")}

	credential_scope="${today}/${AWS_REGION_NAME}/${AWS_SERVICE_NAME}/aws4_request"

	signed_headers="host;x-amz-content-sha256;x-amz-date;x-amz-storage-class"
	header_host="host:$(printf ${api_url} | awk -F/ '{print $3}')"
	header_x_amz_content="x-amz-content-sha256:UNSIGNED-PAYLOAD"
	header_x_amz_date="x-amz-date:${timestamp}"
	header_x_amz_storage_class="x-amz-storage-class:REDUCED_REDUNDANCY"

	# Upload
	curl -T "$filename" -X "${method}" "${api_url}" -H "$(make_auth_header)" -H "${header_host}" -H "${header_x_amz_content}" -H "${header_x_amz_date}" -H "${header_x_amz_storage_class}"
}

function handler () {
    # Name the first argument.
    EVENT_DATA=$1
    
    # Extract the "key": "filename" from data.
    KEY="$(echo $EVENT_DATA | gawk 'match($0, /\"key\":\"(.*)\.java/, a) {print a[1]}').java"
    filename="$(basename $KEY)"
    
    # Download from S3
    download_file $KEY $filename 
        
    # Try to compile
    if /tmp/java-se-8u41-ri/bin/javac $filename; then
    
    	# Replace `.java` extension with `.class` for upload
	    KEY="$(echo $KEY | sed 's/.java/.class/')"
	    filename="$(echo $filename | sed 's/.java/.class/')"
	    
	    # Upload back to S3
	    upload_file $KEY $filename
	    
	    RESPONSE="{\"statusCode\": 200, \"body\": \"Successfully compiled $KEY\"}"
	else
		RESPONSE="{\"statusCode\": 500, \"body\": \"Compilation failed! (key: $KEY)\"}"
	fi
	echo $RESPONSE
}