import re


def split_csv(line):
    reg = r"(?:^|,)(?=[^\"]|(\")?)\"?((?(1)[^\"]*|[^,\"]*))\"?(?=,|$)"
    return [m[1] for m in re.findall(reg, line)]
