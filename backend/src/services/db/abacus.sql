CREATE TABLE public.user (
	uid uuid,
	display_name varchar,
	password varchar,
	role varchar,
	username varchar
);
CREATE TABLE public.setting (
	points_per_no varchar,
	end_date varchar,
	points_per_yes varchar,
	practice_end_date varchar,
	practice_start_date varchar,
	start_date varchar,
	competition_name varchar,
	points_per_compilation_error varchar,
	points_per_minute varchar,
	practice_name varchar
);
CREATE TABLE public.problem (
	capped_points boolean,
	description varchar,
	design_document varchar,
	division varchar,
	id varchar,
	max_points int,
	name varchar,
	pid varchar,
	practice boolean,
	project_id varchar,
	skeletons json,
	solutions json,
	tests json
);
CREATE TABLE public.submission (
	sid varchar,
	claimed varchar,
	date varchar,
	division varchar,
	filename varchar,
	filesize int,
	language varchar,
	md5 varchar,
	pid varchar,
	released boolean,
	runtime int,
	score int,
	source varchar,
	status varchar,
	sub_no int,
	tests json,
	tid varchar,
	viewed boolean
);