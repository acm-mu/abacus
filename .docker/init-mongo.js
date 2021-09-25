db.getSiblingDB('abacus')

db.createUser({
  user: "username",
  pwd: "password",
  roles: [{
    role: "readWrite",
    db: "abacus"
  }]
})

db.createCollection('user')

db.user.insert({
  uid: "b126d7588b184db7818693c2ab891887",
  display_name: "Admin",
  password: "65df4b1116b849b2d02063932b1472a2c15545908d2bdb029c14bd710158c1e2", // goldeneagles
  role: "admin",
  username: "admin"
})

db.createCollection('submission')

db.createCollection('clarification')

db.createCollection('setting')

db.setting.insert({
  competition_name: "Local Environment",
  practice_name: "Local Environment [PRACTICE]",
  practice_start_date: `${(Date.now() / 1000)}`,
  practice_end_date: `${(Date.now() + (24 * 60 * 60 * 1000)) / 1000}`,
  start_date: `${(Date.now() + (24 * 60.5 * 60 * 1000)) / 1000}`,
  end_date: `${(Date.now() + (24 * 63.5 * 60 * 1000)) / 1000}`,
  points_per_no: "20",
  points_per_yes: "0",
  points_per_compilation_error: "0",
  points_per_minute: "1"
})


db.createCollection('problem')

db.problem.insert({
  pid: "80c1ebf62556425ca5ea0a07b948b1e2",
  description: "### Problem Description\n\nComplete this problem to help us test if the competition software is working for all teams.\n\n> Pay attention to these side-notes in this practice problem. They explain the format of this document, which matches the format of the actual competition problems.\n\n> Problems descriptions end with a problem statement, which summarizes the task:\n\nTo complete this practice problem, **create a game in which when the cat sprite is clicked, it will start moving around the screen randomly. Each time the sprite is clicked it will also decrease in size and re-route its direction to be random**.\n\n> Often times there will be extra clarifications after the problem statement explaining technical details.\n\nYou are given one cat sprite and a galaxy backdrop, but you may change these if you want.",
  division: "gold",
  id: "PP",
  name: "Practice Problem",
  practice: "true",
  project_id: "514410859"
})

db.problem.insert({
  pid: "51eac872fcb04cd39f2a186e44013926",
  description: "### Problem Description\n\nComplete this problem to help us test if the competition software is working for all teams.\n\n> Pay attention to these side-notes in this practice problem. They explain the format of this document, which matches the format of the actual competition problems.\n\n> Problems descriptions end with a problem statement, which summarizes the task:\n\nTo complete this practice problem, **write a program that returns whether or not a given value is odd**.\n\n> Often times there will be extra clarifications after the problem statement explaining technical details.\n\nFor this problem, zero is considered even. The program should indicate as such.\n\n---\n## Writing Your Solution\n\n> For each problem, we provide a code \"skeleton\": a pre-made Java or Python program that handles the parsing and printing of program input and output (through the console). Simply edit the indicated method in the pre-made skeleton to solve the problem, and leave the rest of the skeleton unchanged.\n\n> You are not required to use the code skeletons, but **it is highly recommended**. Each problem has strict input and output format requirements, and these skeletons can help you conform to those requirements.\n\nEnter your solution in the body of this method in the given code skeleton:\n\n### Method Signature\n\n#### Java\n\n```public static boolean isOdd(int input)```\n\n#### Python\n\n```def is_odd(input): ```\n\n### Sample Method Calls\n\n#### Java\n\n`isOdd(2)`\nreturns boolean value `false`\n\n`isOdd(3)`\nreturn boolean value `true`\n\n#### Python\n\n`is_odd(2)`\nreturns boolean value `False`\n\n`is_odd(3)`\nreturns boolean value `True`\n\n---\n\n## Testing Your Program from the Console\n\n> When you are done writing your program, you can test it out by entering input into the console in the format described in this section. This is the format that we will use and expect when we test your solution.\n\n### Console Input Format\n\n* the first input line contains, `t`, the number of tests\n> Most problems will input multiple test cases during a single run of the program.\n* then, for each test, a single line containing the input number to check, `x`\n\n### Assumptions\n\n> Our test data (used to judge your solution) will *always* adhere to the assumptions listed in this section of each problem.\n\n* 1 &le; `t` &le; 10\n* 0 &le; `x` &le; 1000\n* `x` will always be a whole number\n* A value of `x` equal to zero is valid input; when `x` = 0, the program should output that `x` is even\n\n### Console Output Format\n\n* for each test, output a single line. Print \"Odd\" if `x` is true, otherwise print \"Even\"\n\n### Sample Run\n\n> Every test provides a sample set of input and expected output. When you run your completed program, typing in the data under \"Input:\" should yield the data under \"Output:\".\n\n> For judging, we use additional test cases, besides those in the Sample Runs. Pay close attention to the \"Assumptions\" section of each problem, and think of other possible inputs to try out before submitting your solution.\n\n#### Input:\n\n```\n3\n1\n2\n0\n```\n\n(3 is `t`, and the following values were different `x` cases)\n\n#### Output:\n\n```\nOdd\nEven\nEven\n```\n",
  division: "blue",
  id: "PP",
  name: "Practice Problem",
  practice: "true",
  skeletons: [{
    file_name: "PracticeProblem.py",
    language: "python",
    source: "def is_odd(x):\n    \"\"\"\n    TODO: Complete this function, which should return whether or not the input number is odd.\n\n    Parameters:\n        x --> (integer) the input number\n\n    Returns:\n        result --> (boolean) True if x is odd, and False otherwise\n    \"\"\"\n\n    return result\n\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    num_cases = int(input())\n\n    for _ in range(num_cases):\n        x = int(input())\n        x_is_odd = is_odd(x)\n\n        if x_is_odd:\n            print('Odd')\n        else:\n            print('Even')\n\n\nmain()"
  }, {
    file_name: "PracticeProblem.java",
    language: "java",
    source: "// Do NOT include a package statement at the top of your solution.\r\n\r\nimport java.util.Scanner;\r\n\r\npublic class PracticeProblem {\r\n\r\n    /*\r\n     * It is unnecessary to edit the \"main\" method of each problem's provided code\r\n     * skeleton. The main method is written for you in order to help you conform to\r\n     * input and output formatting requirements.\r\n     */\r\n    public static void main(String[] args) {\r\n        Scanner kb = new Scanner(System.in);\r\n        int numCases = kb.nextInt();\r\n        for (int iCase = 0; iCase < numCases; iCase++) {\r\n            int x = kb.nextInt();\r\n            boolean xIsOdd = isOdd(x);\r\n            if (xIsOdd) {\r\n                System.out.println(\"Odd\");\r\n            } else {\r\n                System.out.println(\"Even\");\r\n            }\r\n        }\r\n        kb.close();\r\n    }\r\n\r\n    public static boolean isOdd(int x) {\r\n        boolean result = false;\r\n\r\n        // Write some code here\r\n\r\n        return result;\r\n    }\r\n}"
  }],
  solutions: [{
    file_name: "PracticeProblem.py",
    language: "python",
    source: "def is_odd(x):\n    \"\"\"\n    TODO: Complete this function, which should return whether or not the input number is odd.\n\n    Parameters:\n        x --> (integer) the input number\n\n    Returns:\n        result --> (boolean) True if x is odd, and False otherwise\n    \"\"\"\n    result = False\n\n    result = (x % 2 != 0)\n\n    return result\n\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    num_cases = int(input())\n\n    for _ in range(num_cases):\n        x = int(input())\n        x_is_odd = is_odd(x)\n\n        if x_is_odd:\n            print('Odd')\n        else:\n            print('Even')\n\n\nmain()"
  }, {
    file_name: "PracticeProblem.java",
    language: "java",
    source: "// Do NOT include a package statement at the top of your solution.\n\nimport java.util.Scanner;\n\npublic class PracticeProblem {\n\n    /*\n     * It is unnecessary to edit the \"main\" method of each problem's provided code\n     * skeleton. The main method is written for you in order to help you conform to\n     * input and output formatting requirements.\n     */\n    public static void main(String[] args) {\n        Scanner kb = new Scanner(System.in);\n        int numCases = kb.nextInt();\n        for (int iCase = 0; iCase < numCases; iCase++) {\n            int x = kb.nextInt();\n            boolean xIsOdd = isOdd(x);\n            if (xIsOdd) {\n                System.out.println(\"Odd\");\n            } else {\n                System.out.println(\"Even\");\n            }\n        }\n        kb.close();\n    }\n\n    public static boolean isOdd(int x) {\n        boolean result = false;\n\n        result = (x % 2 != 0);\n\n        return result;\n    }\n}"
  }],
  tests: [{ in: "2\n1\n2",
    out: "Odd\nEven"
  }, { in: "4\n0\n1\n2\n3",
    include: false,
    out: "Even\nOdd\nEven\nOdd"
  }, { in: "3\n0\n1000\n555",
    include: false,
    out: "Even\nEven\nOdd"
  }]
})