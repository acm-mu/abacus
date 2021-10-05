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
    password: "65df4b1116b849b2d02063932b1472a2c15545908d2bdb029c14bd710158c1e2",
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
    tests: [{
        in: "2\n1\n2",
        out: "Odd\nEven"
    }, {
        in: "4\n0\n1\n2\n3",
        include: false,
        out: "Even\nOdd\nEven\nOdd"
    }, {
        in: "3\n0\n1000\n555",
        include: false,
        out: "Even\nEven\nOdd"
    }]
})

db.problem.insert({
    tests: [
        {
            in: "4\n100\n75\n50\n25",
            out: "109.0\n90.25\n71.5\n52.75"
        },
        {
            in: "4\n1000\n0\n22\n33",
            include: false,
            out: "784.0\n34.0\n50.5\n58.75"
        },
        {
            in: "2\n420\n69",
            include: false,
            out: "349.0\n85.75"
        }
    ],
    pid: "dad3eca2f8dc4052bf48420cd0f5096e",
    description: "You and your friend Elon are really into astronomy and space travel. Matter of fact, you two have created a company together to travel to Mars called OrbitalExpress, or OE for short. OE is getting ready to launch on its first route to the Red Planet and they want to advise their passengers what type of clothes to pack. \n\nBecause of atmospheric differences, there is no great way to figure out the temperature on the planet using our current standards for temperature (Celsius and Fahrenheit). Elon has done enough research and created a new unit of measure for temperature on the Martian Planet. He calls it Martian Units, or MU for short. He has also developed an equivalent measure for here on Earth called Global Overtemps, or GO for short.\n\nAt first, Elon thought these two units were standardized and were a direct conversion. But you, being the math wizard you are, realized that they are **not** standardized and need some sort of conversion tool.\n\n### Problem Description\n\nWithout some sort of converter, there is no way to figure out what temperature it will be on Mars.\n\nYou do some research and find that Martian Units can be converted to Global Overtemps rather easily following this formula:\n\n_go_ = _( mu &times; 3/4 ) + 34_\n\nWith _go_ representing the resulting temperature in Global Overtemps, and _mu_ being the inputted temperature in Martian Units.\n\nTo solve this problem, **write a program that uses the formula above to calculate the temperature in Global Overtemps (GO) given the temperature in Martian Units (MU).**\n\n### Writing Your Solution\n\nTo find the temperature in Global Overtemps, apply the formula to every inputted temperature in Martian Units.\n\nEnter your solution in the body of the following method in the given code skeleton.\n\n### Method Signature\n\n#### Java\n\n`public static double converter(int mu)`\n\n#### Python\n\n`def converter(mu)`\n\n### Sample Method Call\n\n#### Java\n\n`converter(100)`\nreturns `109.0`\n\n#### Python\n\n`converter(100)`\nreturns `109.0`\n\n## Testing Your Program from the Console\n\n### Console Input Format\n\n- the first line contains the number of test cases, `t`\n- for each test, a single line containing the input temperature to convert, `mu`\n\n### Console Output Format\n\n- For each test, a single line with the converted temperature.\n\n### Assumptions\n\n- 1 &le; `t` &le; 10\n- 0 &le; `mu` &le; 10000\n\n### Sample Run\n\n#### Input:\n\n```\n2\n100\n50\n```\n\n#### Output:\n\n```\n109.0\n71.5\n```\n",
    id: "A",
    solutions: [
        {
            file_name: "Martian_Units_Converter.py",
            language: "python",
            source: "def converter(mu):\n    \"\"\"\n    TODO: Complete this function, which should return Martian Units converted to Global Overtemps.\n\n    Parameters:\n        mu --> (integer) the input temperature in Martian Units\n\n    Returns:\n        result --> (float) the temperature converted to Global Overtemps\n    \"\"\"\n    result = 0\n\n    return (mu * (3/4)) + 34\n\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    num_cases = int(input())\n\n    for _ in range(num_cases):\n        martian_units = int(input())\n        global_overtemps = converter(martian_units)\n        print(global_overtemps)\n\n\nmain()\n"
        },
        {
            file_name: "MartianUnitsConverter.java",
            language: "java",
            source: "// Do NOT include a package statement at the top of your solution.\n\nimport java.util.Scanner;\n\npublic class MartianUnitsConverter {\n\n    /*\n     * It is unnecessary to edit the \"main\" method of each problem's provided code\n     * skeleton. The main method is written for you in order to help you conform to\n     * input and output formatting requirements.\n     */\n    public static void main(String[] args) {\n        Scanner kb = new Scanner(System.in);\n        int numCases = kb.nextInt();\n        for (int iCase = 0; iCase < numCases; iCase++) {\n            int martianUnits = kb.nextInt();\n            double globalOvertemps = converter(martianUnits);\n            System.out.println(globalOvertemps);\n        }\n        kb.close();\n    }\n\n    /**\n     * TODO: Complete the following method that converts a temperature in Martian\n     * Units to Global Overtemps based on the given parameters:\n     * \n     * @param mu --> the input temperature in Martian Units\n     * @return result --> the temperature converted to Global Overtemps\n     */\n\n    public static double converter(int mu) {\n        double result = (mu * (3.0 / 4.0)) + 34.0;\n\n        return result;\n    }\n}"
        }
    ],
    name: "Packing for Mars",
    skeletons: [
        {
            file_name: "Martian_Units_Converter.py",
            language: "python",
            source: "def converter(mu):\n    \"\"\"\n    TODO: Complete this function, which should return Martian Units converted to Global Overtemps.\n\n    Parameters:\n        mu --> (integer) the input temperature in Martian Units\n\n    Returns:\n        result --> (float) the temperature converted to Global Overtemps\n    \"\"\"\n    result = 0.0\n\n    # Write your solution here\n\n    return result\n\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    num_cases = int(input())\n\n    for _ in range(num_cases):\n        martian_units = int(input())\n        global_overtemps = converter(martian_units)\n        print(global_overtemps)\n\n\nmain()"
        },
        {
            file_name: "MartianUnitsConverter.java",
            language: "java",
            source: "// Do NOT include a package statement at the top of your solution.\n\nimport java.util.Scanner;\n\npublic class MartianUnitsConverter {\n\n    /**\n     * TODO: Complete the following method that converts a temperature in Martian\n     * Units to Global Overtemps based on the given parameters:\n     * \n     * @param mu --> the input temperature in Martian Units\n     * @return result --> the temperature converted to Global Overtemps\n     */\n\n    public static double converter(int mu) {\n        double result = 0.0;\n\n        // Write your solution here\n\n        return result;\n    }\n\n    /*\n     * It is unnecessary to edit the \"main\" method of each problem's provided code\n     * skeleton. The main method is written for you in order to help you conform to\n     * input and output formatting requirements.\n     */\n    public static void main(String[] args) {\n        Scanner kb = new Scanner(System.in);\n        int numCases = kb.nextInt();\n        for (int iCase = 0; iCase < numCases; iCase++) {\n            int martianUnits = kb.nextInt();\n            double globalOvertemps = converter(martianUnits);\n            System.out.println(globalOvertemps);\n        }\n        kb.close();\n    }\n}"
        }
    ],
    division: "blue"
})

db.problem.insert({
    tests: [
        {
            in: "3\nCCPPPPZZZZZZZZZ\nCPPPPZZZZZZZZZZZ\nCCCPZZZZZZZPZZZZZ",
            out: "This year's harvest is good!\nThis year's harvest is bad!\nThis year's harvest is bad!"
        },
        {
            in: "2\nCCCZZCCCPPZZPPPP\nCCRCPRPPPZZRZZRZZZZRZZZZZZ",
            include: false,
            out: "This year's harvest is bad!\nThis year's harvest is bad!"
        },
        {
            in: "3\nZZZCPPCPPZZ\nCPPCPCZZZCCPPCZRZZZCRPZZ\nRPZZRCZPPPCPPCZZZPRCCPCCPPCZZZZ",
            include: false,
            out: "This year's harvest is bad!\nThis year's harvest is good!\nThis year's harvest is good!"
        }
    ],
    pid: "82ff8407461f4c6c9a852dbff68625e2",
    description: "### Problem Description\n\nFarmer Hank owns a farm that grows corn, potatoes, and zucchini. Hank has recently upgraded his tracking system to determine if he had a good harvest this year. He has very specific criteria on what he determines to be a good harvest. For a harvest to be considered good, Farmer Hank needs the following out of his harvest:\n* At least 2 corn\n* At least 4 potatoes\n* At least 5 zucchini\n* At least 15 crops total\n* At most 10% of all crops (including the rotten crops) are rotten (we never said he was a good farmer)\n\nIf any of these requirements are not met, then Farmer Hank considered the harvest a failure. The program takes in a string representing the harvest. Each letter represents a crop: \n* `C` represents a cob of corn \n* `P` represents a potatoe\n* `Z` represents a zucchini\n* `R` represents a rotten crop\n\nTo solve this problem, **write a program that determines if this year's harvest is a good harvest.**\n\n---\n## Writing Your Solution\nEnter your solution in the body of this method in the given code skeleton:\n\n### Method Signature (Java)\n`public static boolean isGoodHarvest(String harvest)`\n### Method Signature (Python)\n`def isGoodHarvest(harvest):`\n\n### Sample Method Calls (Java)\n`isGoodHarvest(\"CCCCPPPPZZZZZZZZZZZZR\");`\nreturns `This year's harvest is good!`\n\n\n### Sample Method Calls (Python)\n`isGoodHarvest(\"CCCCPPPPZZZZZZZZZZZZR\")`\nreturns `This year's harvest is good!`\n\n---\n## Testing Your Program from the Console\n### Console Input Format\n* A string with the characters `C`, `P`, `Z`, or `R` to represent the harvest \n\n### Assumptions\n* The string will only contain the capital characters `C`, `P`, `Z`, or `R`\n* The string _**may**_ be empty\n\n### Console Output Format\n* The first line contains the number of test cases, `t`\n* For each test, a single line with either \"This year's harvest is good!\" or \"This year's harvest is bad!\"\n\n### Sample Run\n\n#### Input:\n```\n2\nCPPPPZZZZZZZZZZZZZ\nCCCPPPPZZZZZZZZZ\n```\n\n#### Output:\n```\nThis year's harvest is bad!\nThis year's harvest is good!\n```\n\n### Sample Run Explanation\n1. The first harvest is bad because there is not enough corn (recall there needs to be at least two corn)\n2. The second harvest meets all the requirements and thus is considered a good harvest.\n",
    id: "B",
    solutions: [
        {
            file_name: "Hanks_Harvest.py",
            language: "python",
            source: "def isGoodHarvest(harvest):\n    \"\"\"\n    TODO: Determine if this year's harvest was considered good based on given criteria:\n\n    @param havest --> (string) A representation of this year's harvest where each character represents a crop.\n\n    @return result --> (boolean) True if the harvest is considered good, False if the harvest is considered bad\n    \"\"\"\n    \n    numCorn = 0\n    numPotatoes = 0\n    numZucchini = 0\n    numRotten = 0.0\n    numTotal = 0\n    holder = \"\"\n\n    for i in range(0, len(harvest)):\n        holder = harvest[i]\n        if(holder == \"C\"):\n            numCorn+=1\n        elif(holder == \"P\"):\n            numPotatoes+=1\n        elif(holder == \"Z\"):\n            numZucchini+=1\n        elif(holder == \"R\"):\n            numRotten+=1\n        \n        numTotal+=1\n\n    if(numCorn >= 2 and numPotatoes >= 4 and numZucchini >= 5 and ((numRotten/numTotal)<=.10) and numTotal >= 15):\n        return True\n    else:\n        return False\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    for _ in range(int(input())):\n        harvest = input()\n        is_good_harvest = isGoodHarvest(harvest)\n        if(is_good_harvest):\n            print(\"This year's harvest is good!\")\n        else:\n            print(\"This year's harvest is bad!\")\n\nmain()\n"
        },
        {
            file_name: "HanksHarvest.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class HanksHarvest {\n\t\n\t/**\n     * TODO: Determine if this year's harvest was considered good based on given criteria:\n     *\n     * @param havest --> (String) A representation of this year's harvest where each character represents a vegetable.\n     *\n     * @return result --> (boolean) true if the harvest is considered good, false if the harvest is considered bad\n     */\n\tpublic static boolean isGoodHarvest(String harvest) {\n\t\tint numCorn = 0;\n\t\tint numPotatoes = 0;\n\t\tint numZucchini = 0;\n\t\tdouble numRotten = 0;\n\t\tdouble numTotal = 0;\n\t\tString holder = \"\";\n\t\t\n\t\tfor(int i=0; i<harvest.length(); i++) {\n\t\t\tholder = harvest.substring(i, i+1);\n\t\t\tif(holder.equals(\"C\")) {\n\t\t\t\tnumCorn++;\n\t\t\t}\n\t\t\telse if(holder.equals(\"P\")) {\n\t\t\t\tnumPotatoes++;\n\t\t\t}\n\t\t\telse if(holder.equals(\"Z\")) {\n\t\t\t\tnumZucchini++;\n\t\t\t}\n\t\t\telse if(holder.equals(\"R\")) {\n\t\t\t\tnumRotten++;\n\t\t\t}\n\t\t\tnumTotal++;\n\t\t}\n\n\t\tif(numCorn>=2 && numPotatoes>=4 && numZucchini>=5 && ((numRotten/numTotal)<=.10) && numTotal >= 15) {\n\t\t\treturn true;\n\t\t}\n\t\telse {\n\t\t\treturn false;\n\t\t}\n\t\t\n\t}\n\n\t/*\n\t* It is unnecessary to edit the \"main\" method of each problem's provided code\n\t* skeleton. The main method is written for you in order to help you conform to\n\t* input and output formatting requirements.\n\t*/\n\tpublic static void main(String[] args) {\n\n\t\tScanner in = new Scanner(System.in);\n\t\t\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            String harvest = in.nextLine();\n            boolean isGoodHarvest = isGoodHarvest(harvest);\n            if(isGoodHarvest){ \n                System.out.println(\"This year's harvest is good!\");\n            } else {\n                System.out.println(\"This year's harvest is bad!\");\n            }\n        }\n\n        in.close();\n\t}\n}\n"
        }
    ],
    name: "Hank's Harvest",
    skeletons: [
        {
            file_name: "Hanks_Harvest.py",
            language: "python",
            source: "\"\"\"\nTODO: Determine if this year's harvest was considered good based on given criteria:\n\n@param havest --> A representation of this year's harvest where each character represents a crop.\n\n@return result --> True if the harvest is considered good, False if the harvest is considered bad\n\"\"\"\ndef isGoodHarvest(harvest):\n\n    # Write your solution here\n\n    return False\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    for _ in range(int(input())):\n        harvest = input()\n        is_good_harvest = isGoodHarvest(harvest)\n        if(is_good_harvest):\n            print(\"This year's harvest is good!\")\n        else:\n            print(\"This year's harvest is bad!\")\n\nmain()"
        },
        {
            file_name: "HanksHarvest.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class HanksHarvest {\n\t\n\t/**\n     * TODO: Determine if this year's harvest was considered good based on given criteria:\n     *\n     * @param havest --> (String) A representation of this year's harvest where each character represents a crop.\n     *\n     * @return result --> (boolean) true if the harvest is considered good, false if the harvest is considered bad\n     */\n\tpublic static boolean isGoodHarvest(String harvest) {\n\n        // Write your solution here\n\n\t\treturn false;\n\t}\n\n\t/*\n\t* It is unnecessary to edit the \"main\" method of each problem's provided code\n\t* skeleton. The main method is written for you in order to help you conform to\n\t* input and output formatting requirements.\n\t*/\n\tpublic static void main(String[] args) {\n\n\t\tScanner in = new Scanner(System.in);\n\t\t\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            String harvest = in.nextLine();\n            boolean isGoodHarvest = isGoodHarvest(harvest);\n            if(isGoodHarvest){ \n                System.out.println(\"This year's harvest is good!\");\n            } else {\n                System.out.println(\"This year's harvest is bad!\");\n            }\n        }\n\n        in.close();\n\t}\n}\n"
        }
    ],
    division: "blue"
})

db.problem.insert({
    tests: [
        {
            in: "2\n4\n10.0 20.0 1 15.0\n0 1 4 7\n30\n3\n10.0 20.0 1\n0 0 0\n100.6",
            out: "0 1 4 2\n0 0 0"
        },
        {
            in: "2\n5\n10.0 20.0 1 15.0 4.0\n1 1 4 7 6\n0\n7\n5.64 9.9 1 15.0 4.0 17.90 17.91\n6 4 17 7 6 2 3\n17.90",
            include: false,
            out: "0 0 0 0 0\n3 1 17 1 4 1 0"
        },
        {
            in: "2\n1\n10\n100\n100.1\n9\n10 20 30 40 50 60 70 80 90\n1 2 3 4 5 6 7 8 9\n100",
            include: false,
            out: "10\n1 2 3 2 2 1 1 1 1"
        }
    ],
    pid: "047f846caa0e4d2faa5f582e174de73a",
    description: "### Problem Description\n\nAlex and her friends are studying (while practicing social distancing) for their exam next week.  Alex, being the good friend that she is, offered to buy the entire group snacks from the vending machine.  To keep it simple for Alex, they all decided to choose the same item.  Alex only a set amount of cash in her wallet.  The group needs to calculate how many of each item she can buy with the cash in her wallet.  \n\nTo solve this problem, **write a program that determines how many of each item you can buy with the given cash.**\n\n---\n## Writing Your Solution\nEnter your solution in the body of this method in the given code skeleton:\n\n### Method Signature (Java)\n```public static int[] vendingOptions(int numberOfItemsInMachine, int[] itemQuantities, double[] itemPrices, double cash)```\n### Method Signature (Python)\n```def vendingOptions(numberOfItemsInMachine, itemQuantities, itemPrices, cash):```\n\n### Sample Method Calls (Java)\n`vendingOptions(4, new int[]{ 2, 1, 4, 7 }, new double[]{ 10.0, 20.0, 7.0, 15.0 }, 25.5)`\nreturns `[2, 1, 3, 1]`\n\n\n### Sample Method Calls (Python)\n`vendingOptions(4, [2, 1, 4, 7], [10.0, 20.0, 7.0, 15.0], 25.5)`\nreturns `[2, 1, 3, 1]`\n\n---\n## Testing Your Program from the Console\n### Console Input Format\n* The first line contains the number of test cases, `t`\n\nFor each test:\n* The first line will contain the number of items in the vending machine\n* The second line will contain the price of each item separated by a space\n* The third line will contain the quantity of each item separated by a space\n* The fourth line will contain the total allowance\n\n### Assumptions\n* `numberOfItemsInMachine` > 0\n* The number of elements in `itemQuantities` and `itemPrices` will always be equal to `numberOfItemsInMachine`\n* Every price in `itemPrices` > 0\n* Every quantity in `itemQuantities` &ge; 0\n* `totalAllowance` &ge; 0\n\n### Console Output Format\n* A single line with the quantity of each item you can afford separated by a space\n\n### Sample Run\n\n#### Input:\n\n```\n1\n4\n10.0 20.0 7.0 15.0\n2 1 4 7\n25.5\n```\n\n#### Output:\n```\n2 1 3 1\n```",
    id: "C",
    solutions: [
        {
            file_name: "Vending_Machine.py",
            language: "python",
            source: "\"\"\"\nTODO: Write a program that determines how many of each item you can buy given the following parameters:\n\nParameters:\nnumberOfItemsInMachine --> (integer) The number of items in the vending machine.\nitemQuantities --> (integer array) The quantities of each item in the vending machine\nitemPrices --> (float array) The price of each item in the vending machine\ntotalAllowance --> (float) The amount of money you have to spend\n\nReturns:\nnew integer array --> an integer array containing the number of each item you can buy.\n\n\"\"\"\ndef vendingOptions(numberOfItemsInMachine, itemQuantities, itemPrices, totalAllowance):\n    counter = 0.0\n    buyable = [0] * numberOfItemsInMachine\n\n    for x in range(numberOfItemsInMachine):\n        while counter <= totalAllowance and (counter/itemPrices[x])<itemQuantities[x]:\n            if (counter+itemPrices[x]) > totalAllowance:\n                break\n            else:\n                counter += itemPrices[x]\n        buyable[x] = int(counter/itemPrices[x])\n        counter = 0.0\n\n    return buyable\n    \n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n\n    for _ in range(int(input())):\n        # User Input #\n        numOfItems = input()\n        prices = input().split(\" \")\n        quantities = input().split(\" \")\n        allowance = input()\n\n        itemCount = int(numOfItems)\n        itemPrices = [0] * itemCount\n        itemQuantities = [0] * itemCount\n        totalAllowance = float(allowance)\n\n        for x in range(itemCount):\n            itemPrices[x] = float(prices[x])\n            itemQuantities[x] = int(quantities[x])\n\n        # Function Call\n        canBuy = vendingOptions(itemCount, itemQuantities, itemPrices, totalAllowance)\n\n        # Terminal Output #\n        print(*canBuy, sep=' ')\n\nmain()"
        },
        {
            file_name: "VendingMachine.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class VendingMachine {\n\n\tpublic static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            String numOfItems = in.nextLine();\n            String[] prices = in.nextLine().split(\" \");\n            String[] quantities = in.nextLine().split(\" \");\n            String allowance = in.nextLine();\n\n            int itemCount = Integer.parseInt(numOfItems);\n            double[] itemPrices = new double[itemCount];\n            int[] itemQuantities = new int[itemCount];\n            double totalAllowance = Double.parseDouble(allowance);\n\n            for (int i = 0; i < itemCount; i++) {\n                itemPrices[i] = Double.parseDouble(prices[i]);\n                itemQuantities[i] = Integer.parseInt(quantities[i]);\n            }\n\n            int[] canBuy = vendingOptions(itemCount, itemQuantities, itemPrices, totalAllowance);\n\n            for (int i = 0; i < itemCount; i++){\n            \tif (i != itemCount - 1){\n                    System.out.print(canBuy[i] + \" \");\n                } else {\n                    System.out.print(canBuy[i]);\n                }\n            }\n            System.out.println(\"\");\n        }\n        \n        in.close();\n\t}\n\t\n\t\n\t/*\n\t * Problem description\n\t * test data (potential; test run)\n\t * what they have to do specifically\n\t * \n\t * Fill the code in this method.\n\t * \n\t * Given an array of doubles (prices of vending machine items), and a second array of integers (quantities of those items), and an amount of money as a double.\n\t * return how much if any, of each item you could buy if you used all your money on a single item.  \n\t * \n\t * also have a second array of quantities of each item and return how many of each item you could buy if you only bought that item. \n\t * \n\t * \n\t */\n\tpublic static int[] vendingOptions(int numberOfItemsInMachine, int[] itemquantities, double[] itemPrices, double availiableMoney)\n\t{\n\t\tdouble counter = 0.0;\n\t\tint[] buyable =new int[numberOfItemsInMachine];\n\t\tfor(int x = 0; x < numberOfItemsInMachine; x++)\n\t\t{\n\t\t\twhile(counter<=availiableMoney && (counter/itemPrices[x])<itemquantities[x])\n\t\t\t{\n\t\t\t\tif((counter+itemPrices[x])>availiableMoney)\n\t\t\t\t\tbreak;\n\t\t\t\telse\n\t\t\t\t\tcounter+= itemPrices[x];\n\t\t\t}\n\t\t\tbuyable[x]= (int)(counter/itemPrices[x]);\n\t\t\tcounter = 0.0;\n\t\t}\n\t\treturn buyable;\n\t}\n\n}"
        }
    ],
    name: "Vending Machine",
    skeletons: [
        {
            file_name: "Vending_Machine.py",
            language: "python",
            source: "\"\"\"\nTODO: Write a program that determines how many of each item you can buy given the following parameters:\n\nParameters:\nnumberOfItemsInMachine --> (integer) The number of items in the vending machine.\nitemQuantities --> (integer array) The quantities of each item in the vending machine\nitemPrices --> (float array) The price of each item in the vending machine\ncash --> (float) The amount of money you have to spend\n\nReturns:\nnew integer array --> an integer array containing the number of each item you can buy.\n\n\"\"\"\ndef vendingOptions(numberOfItemsInMachine, itemQuantities, itemPrices, cash):\n\n    # Write your solution here\n\n    return []\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n\n    for _ in range(int(input())):\n        # User Input #\n        numOfItems = input()\n        prices = input().split(\" \")\n        quantities = input().split(\" \")\n        allowance = input()\n\n        itemCount = int(numOfItems)\n        itemPrices = [0] * itemCount\n        itemQuantities = [0] * itemCount\n        cash = float(allowance)\n\n        for x in range(itemCount):\n            itemPrices[x] = float(prices[x])\n            itemQuantities[x] = int(quantities[x])\n\n        # Function Call\n        canBuy = vendingOptions(itemCount, itemQuantities, itemPrices, cash)\n\n        # Terminal Output #\n        print(*canBuy, sep=' ')\n\nmain()"
        },
        {
            file_name: "VendingMachine.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class VendingMachine {\n\n    /**\n    * TODO: Write a program that determines how many of each item you can buy given the following parameters:\n    * \n    * @param numberOfItemsInMachine --> (integer) The number of items in the vending machine.\n    * @param itemQuantities --> (integer array) The quantities of each item in the vending machine\n    * @param itemPrices --> (double array) The price of each item in the vending machine\n    * @param cash --> (double) The amount of money you have to spend\n    *\n    * @return new integer array --> an integer array containing the number of each item you can buy.\n    */\n    public static int[] vendingOptions(int numberOfItemsInMachine, int[] itemQuantities, double[] itemPrices, double cash) {\n\n        // Write your solution here\n\n        return new int[numberOfItemsInMachine];\n    }\n\n    /*\n    * It is unnecessary to edit the \"main\" method of each problem's provided code\n    * skeleton. The main method is written for you in order to help you conform to\n    * input and output formatting requirements.\n    */\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            String numOfItems = in.nextLine();\n            String[] prices = in.nextLine().split(\" \");\n            String[] quantities = in.nextLine().split(\" \");\n            String allowance = in.nextLine();\n\n            int itemCount = Integer.parseInt(numOfItems);\n            double[] itemPrices = new double[itemCount];\n            int[] itemQuantities = new int[itemCount];\n            double cash = Double.parseDouble(allowance);\n\n            for (int i = 0; i < itemCount; i++) {\n                itemPrices[i] = Double.parseDouble(prices[i]);\n                itemQuantities[i] = Integer.parseInt(quantities[i]);\n            }\n\n            int[] canBuy = vendingOptions(itemCount, itemQuantities, itemPrices, cash);\n\n            for (int i = 0; i < itemCount; i++){\n            \tif (i != itemCount - 1){\n                    System.out.print(canBuy[i] + \" \");\n                } else {\n                    System.out.print(canBuy[i]);\n                }\n            }\n            System.out.println(\"\");\n        }\n        \n        in.close();\n\t}\n\n}"
        }
    ],
    division: "blue"
})

db.problem.insert({
    tests: [
        {
            in: "2\n18000000 18000000 18000000 18000000 18000000 18000000 18000000 18000000 18000000 18000000\n18000000 0 0 0 0 0 0 0 0 0",
            out: "1 1 1 1 1 1 1 1 1 1\n0 0 0 0 0 0 0 0 0 1"
        },
        {
            in: "2\n1226801334 678365946 1548955537 773544442 1885074959 537675215 891016372 1181969843 1845826778 1563107091\n145151317 1861338887 72988985 1833134724 284456378 639358767 1249054102 881159972 423387754 267859145",
            include: false,
            out: "30 38 43 50 66 68 86 87 103 105\n4 8 15 16 24 36 49 69 102 103"
        },
        {
            in: "2\n1603473699 45894908 354166433 580351390 643134073 160720773 44894056 994624726 1588317122 433302777\n19205632 16412509 1356625 16711198 3151711 13075301 5467633 16185011 8833422 5393985",
            include: false,
            out: "2 3 9 20 24 32 36 55 88 89\n0 0 0 0 0 1 1 1 1 1"
        }
    ],
    pid: "67418715303c4a309f8b6e902c01c685",
    description: "### Problem Description\n\nSpace Captain Zap B has been traveling the galaxy for several years. However, his water supplies are exhausted and he needs to find a place to land. Using his ship, he was able to identify ten planets that have the necessary elements to replenish his reserves. Due to the ship traveling at the speed of light, it's imperative Zap knows exactly how long he should travel towards a planet. Too short of a time and Zap would undershoot. Too long and Zap would overshoot.\nGiven these planets, their distances calculate how many seconds Zap needs to travel to reach each planet based on his starting position.\n\nTo solve this problem, **calculate and sort (smallest value first) the time (in minutes) it will take Captain Zap to get to each planet.**\n\n>Note:  The speed of light is 300000 _km/s_\n\n>Note:  Use _t = d/s_ where _t_ is the time, _d_ is the distance, and _s_ is the speed\n\n>Note:  Round to the nearest minute.\n\n---\n## Writing Your Solution\nEnter your solution in the body of this method in the given code skeleton:\n\n### Method Signature (Java)\n```public static int[] distanceFinder(int[] distances)```\n### Method Signature (Python)\n```def distanceFinder(distances):```\n\n### Sample Method Calls (Java)\n`distanceFinder(new int[]{ 23854982, 139892309, 599023903, 9859390, 498439803, 98439309, 18182399, 314568764, 3828989, 83828938})`\nreturns `[ 0, 1, 1, 1, 5, 5, 8, 17, 28, 33 ]`\n\n\n### Sample Method Calls (Python)\n`distanceFinder([23854982, 139892309, 599023903, 9859390, 498439803, 98439309, 18182399, 314568764, 3828989, 83828938])`\nreturns `[ 0, 1, 1, 1, 5, 5, 8, 17, 28, 33 ]`\n\n---\n## Testing Your Program from the Console\n### Console Input Format\n* The first line contains the number of test cases, `t`\n* A single line containing each distance followed by a space\n\n### Assumptions\n* The number of planets is always `10`\n* All distances will be &ge; 0\n* All distances are given in kilometers\n\n### Console Output Format\n* A single line with the sorted output separated by a space\n\n### Sample Run\n\n#### Input:\n```\n1\n23854982 139892309 599023903 9859390 498439803 98439309 18182399 314568764 3828989 83828938\n```\n\n#### Output:\n```\n0 1 1 1 5 5 8 17 28 33\n```",
    id: "D",
    solutions: [
        {
            file_name: "Out_of_Water.py",
            language: "python",
            source: "\"\"\"\nTODO: Calculate and sort (smallest value first) the time (in minutes) it will take Captain Zap to get to each planet given the following parameters:\n\nParameters:\ndistances --> (integer array) the distance (in km) needed to reach each planet\n\nReturns:\na sorted array of integers (from least to greatest) representing the number of minutes it will take to reach each planet\n\nNOTE:  The speed of light is 300000 km/s\nNOTE:  Round the nearest minute\n\"\"\"\ndef distanceFinder(distances):\n    lista = list()\n    for ele in distances:\n        y = ele / 300000\n        y = y / 60\n        lista.append(round(y))\n    lista.sort()\n    return lista\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n\n    for _ in range(int(input())):\n        # User Input #\n        inp = input().split(\" \")\n        distances = []\n\n        for i in inp:\n            distances.append(int(i))\n\n        # Function Call\n        returnedVals = distanceFinder(distances)\n\n        # Terminal Output #\n        print(*returnedVals, sep=' ')\n\nmain()"
        },
        {
            file_name: "OutofWater.java",
            language: "java",
            source: "import java.util.Scanner;\nimport java.util.Arrays;\n\npublic class OutOfWater {\n\n    /*\n    * It is unnecessary to edit the \"main\" method of each problem's provided code\n    * skeleton. The main method is written for you in order to help you conform to\n    * input and output formatting requirements.\n    */\n    public static void main(String[] args) {\n\n        Scanner in = new Scanner(System.in);\n\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            // User Input\n            String[] inp = in.nextLine().split(\" \");\n            int[] distances = new int[10];\n            for (int i = 0; i < inp.length; i++) {\n                distances[i] = Integer.parseInt(inp[i]);\n            }\n\n            // Function Call\n            int[] returnedVals = distanceFinder(distances);\n\n            // Terminal Output\n            for (int i = 0; i < returnedVals.length; i++){\n            \tif (i != returnedVals.length - 1){\n                    System.out.print(returnedVals[i] + \" \");\n                } else {\n                    System.out.print(returnedVals[i]);\n                }\n            }\n            System.out.println(\"\");\n        }\n\n        in.close();\n    }\n\n    /**\n    * TODO: Calculate and sort (smallest value first) the time (in minutes) it will take Captain Zap to get to each planet given the following parameters:\n    *\n    * Parameters:\n    * @param distances --> (integer array) the distance (in km) needed to reach each planet\n    *\n    * Returns:\n    * @returns a sorted array of integers (from least to greatest) representing the number of minutes it will take to reach each planet\n    *\n    * NOTE:  The speed of light is 300000 km/s\n    * NOTE:  Round the nearest minute\n    */\n    public static int[] distanceFinder(int[] distances) {\n        int[] finalwork = new int[10];\n        double x = 0;\n        double y = 0;\n        for (int i = 0; i < distances.length; i++){\n        x = distances[i];\n        y = x / 300000;\n        y = y / 60;\n        finalwork[i] = (int)Math.round(y);\n        }\n        Arrays.sort(finalwork);\n        \n        return finalwork;\n    }\n}\n"
        }
    ],
    name: "Out of Water!",
    skeletons: [
        {
            file_name: "Out_of_Water.py",
            language: "python",
            source: "\"\"\"\nTODO: Calculate and sort (smallest value first) the time (in minutes) it will take Captain Zap to get to each planet given the following parameters:\n\nParameters:\ndistances --> (integer array) the distance (in km) needed to reach each planet\n\nReturns:\na sorted array of integers (from least to greatest) representing the number of minutes it will take to reach each planet\n\nNOTE:  The speed of light is 300000 km/s\nNOTE:  Use  = d/s where t is the time, d is the distance, and s is the speed\nNOTE:  Round the nearest minute\n\"\"\"\ndef distanceFinder(distances):\n\n    # Write your solution here\n\n    return []\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n\n    for _ in range(int(input())):\n        # User Input #\n        inp = input().split(\" \")\n        distances = []\n\n        for i in inp:\n            distances.append(int(i))\n\n        # Function Call\n        returnedVals = distanceFinder(distances)\n\n        # Terminal Output #\n        print(*returnedVals, sep=' ')\n\nmain()"
        },
        {
            file_name: "OutofWater.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class OutOfWater {\n\n    /**\n    * TODO: Calculate and sort (smallest value first) the time (in minutes) it will take Captain Zap to get to each planet given the following parameters:\n    *\n    * Parameters:\n    * @param distances --> (integer array) the distance (in km) needed to reach each planet\n    *\n    * Returns:\n    * @returns a sorted array of integers (from least to greatest) representing the number of minutes it will take to reach each planet\n    *\n    * NOTE:  The speed of light is 300000 km/s\n    * NOTE:  Use  = d/s where t is the time, d is the distance, and s is the speed\n    * NOTE:  Round the nearest minute\n    */\n    public static int[] distanceFinder(int[] distances) {\n\n        // Write your solution here\n\n        return new int[0];\n    }\n\n    /*\n    * It is unnecessary to edit the \"main\" method of each problem's provided code\n    * skeleton. The main method is written for you in order to help you conform to\n    * input and output formatting requirements.\n    */\n    public static void main(String[] args) {\n\n        Scanner in = new Scanner(System.in);\n\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            // User Input\n            String[] inp = in.nextLine().split(\" \");\n            int[] distances = new int[10];\n            for (int i = 0; i < inp.length; i++) {\n                distances[i] = Integer.parseInt(inp[i]);\n            }\n\n            // Function Call\n            int[] returnedVals = distanceFinder(distances);\n\n            // Terminal Output\n            for (int i = 0; i < returnedVals.length; i++){\n            \tif (i != returnedVals.length - 1){\n                    System.out.print(returnedVals[i] + \" \");\n                } else {\n                    System.out.print(returnedVals[i]);\n                }\n            }\n            System.out.println(\"\");\n        }\n\n        in.close();\n    }\n\n}"
        }
    ],
    division: "blue"
})

db.problem.insert({
    tests: [
        {
            in: "3\n__________\nuuuuuuuuuuuuuuuuuu\nuuu___uuu",
            out: "0\n18\n6"
        },
        {
            in: "2\nudududududud\nuu__dd_uuuuuu",
            include: false,
            out: "1\n6"
        },
        {
            in: "2\nuuuudduduuduu_uuud\ndddduuuu_uuudd_ddd_uu_d",
            include: false,
            out: "8\n3"
        }
    ],
    pid: "f805c29f15f04aaeae2685359ebc47db",
    description: "### Problem Description\n\nDuring the pandemic, Brad has discovered his love for hiking.  He has recently been tracking the elevations of his hikes he takes.  He is using characters to track an increase, decrease, or no change in elevation.  `u` represents an increase in 1 unit of elevation, `d` represents a decrease in 1 unit of elevation, and `_` represents no change.  Given a string of characters `u`, `d`, and `_` find the maximum elevation Brad reaches during a hike.  \n\nTo solve this problem, **write a program to find the maximum elevation Brad reached.**\n\n---\n## Writing Your Solution\nEnter your solution in the body of this method in the given code skeleton:\n\n### Method Signature (Java)\n```public static int findMaxElevation(String log)```\n### Method Signature (Python)\n```def findMaxElevation(log):```\n\n### Sample Method Calls (Java)\n`findMaxElevation(\"uuuudddudu\")`\nreturns `4`\n\n\n### Sample Method Calls (Python)\n`findMaxElevation(\"uuuudddudu\")`\nreturns `4`\n\n---\n## Testing Your Program from the Console\n### Console Input Format\n* The first line contains the number of test cases, `t`\n* For each test, a single line containing the input, `s`\n\n### Assumptions\n* Brad starts at elevation 0\n* The only characters in the string are `u`, `d`, and `_`\n* The elevation will never be negative\n\n### Console Output Format\n* For each test, a single line with the output\n\n### Sample Run\n\n#### Input:\n\n```\n2\nuuudduuduuddd\nuud__duu_ud\n```\n\n#### Output:\n```\n4\n3\n```",
    id: "E",
    solutions: [
        {
            file_name: "Hike_To_The_Peak.py",
            language: "python",
            source: "\"\"\"\nTODO: Find the maximum elevation Brad reached given the following parameters:\n\nParameters:\nlog --> (String) A string representing the change in Brad's elevation\n\nReturns:\nan integer containing the maximum elevation Brad reached\n\n\"\"\"\ndef findMaxElevation(log):\n    peak = 0\n    alt = 0\n    for val in log:\n        if val == 'u':\n            alt += 1\n        elif val == 'd':\n            alt -= 1\n        if alt > peak:\n            peak = alt\n\n    return peak\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n\n    for _ in range(int(input())):\n        # User Input #\n        inp = input()\n\n        # Function Call\n        returnedVal = findMaxElevation(inp)\n\n        # Terminal Output #\n        print(returnedVal)\n\nmain()\n"
        },
        {
            file_name: "HikeToThePeak.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class HikeToThePeak {\n\t\n\tpublic static int findMaxElevation(String log)\n\t{\n\t\tint peak = 0;\n\t\tint alt = 0;\n        char[] logArray = log.toCharArray();\n\n\t\tfor(int x = 0; x < logArray.length; x++) {\n\t\t\tif(logArray[x]=='u')\n\t\t\t\talt += 1;\n\t\t\telse if(logArray[x] == 'd')\n\t\t\t\talt -= 1;\n\n\t\t\tif(alt > peak)\n\t\t\t\tpeak = alt;\n\t\t}\n\t\t\n        return peak;\n\t}\n\n    /*\n    * It is unnecessary to edit the \"main\" method of each problem's provided code\n    * skeleton. The main method is written for you in order to help you conform to\n    * input and output formatting requirements.\n    */\n    public static void main(String[] args) {\n\n        Scanner in = new Scanner(System.in);\n\n        int cases = Integer.parseInt(in.nextLine());\n        for (; cases > 0; cases--) {\n            // User Input\n            String log = in.nextLine();\n\n            // Function Call\n            int returnedVal = findMaxElevation(log);\n\n            // Terminal Output\n            System.out.println(returnedVal);\n        }\n\n        in.close();\n    }\n}\n"
        }
    ],
    name: "Hike to the Peak",
    skeletons: [
        {
            file_name: "Hike_To_The_Peak.py",
            language: "python",
            source: "\"\"\"\nTODO: Find the maximum elevation Brad reached given the following parameters:\n\nParameters:\nlog --> (String) A string representing the change in Brad's elevation\n\nReturns:\nan integer containing the maximum elevation the Brad reached\n\n\"\"\"\ndef findMaxElevation(log):\n\n    # Write your code here\n\n    return 0\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n\n    for _ in range(int(input())):\n        # User Input #\n        inp = input()\n\n        # Function Call\n        returnedVal = findMaxElevation(inp)\n\n        # Terminal Output #\n        print(returnedVal)\n\nmain()\n"
        },
        {
            file_name: "HikeToThePeak.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class HikeToThePeak {\n\n    /**\n    * TODO: Find the maximum elevation Brad reached given the following parameters:\n    *\n    * Parameters:\n    * @param log --> (String) A string representing the change in Brad's elevation\n    *\n    * Returns:\n    * @return an integer containing the maximum elevation Brad reached\n    *\n    */\n    public static int findMaxElevation(String log) {\n\n        // Write your code here\n\n        return 0;\n    }\n\n    /*\n    * It is unnecessary to edit the \"main\" method of each problem's provided code\n    * skeleton. The main method is written for you in order to help you conform to\n    * input and output formatting requirements.\n    */\n    public static void main(String[] args) {\n\n        Scanner in = new Scanner(System.in);\n\n        int cases = Integer.parseInt(in.nextLine());\n        for (; cases > 0; cases--) {\n            // User Input\n            String log = in.nextLine();\n\n            // Function Call\n            int returnedVal = findMaxElevation(log);\n\n            // Terminal Output\n            System.out.println(returnedVal);\n        }\n\n        in.close();\n    }\n\n}"
        }
    ],
    division: "blue"
})

db.problem.insert({
    tests: [
        {
            in: "2\n1/1 1/1\n4/1 4/20",
            out: "0\n13"
        },
        {
            in: "2\n1/1 12/31\n5/1 1/1",
            include: false,
            out: "260\n0"
        },
        {
            in: "3\n8/7 8/9\n6/1 7/20\n10/13 12/31",
            include: false,
            out: "0\n35\n57"
        }
    ],
    pid: "4d71f310f48546fea356461500ade29c",
    description: "### Problem Description\n\nTuring Company makes computers for enterprises in Milwaukee, Wisconsin.  They build computers Monday through Friday.  Recently, they have asked for your help in redoing their payroll software.  In order to calculate payroll for their hourly employees, they need to find the number of weekdays between two dates in 2021.  \n\nTo solve this problem, **calculate the number of weekdays between two dates in 2021.**\n\n>Note: Include the first date in your count (if it's a weekday) but not the second date.\n\n>Note: To help test, here is a [calendar for 2021](https://www.timeanddate.com/calendar/)\n\n---\n## Writing Your Solution\nEnter your solution in the body of this method in the given code skeleton:\n\n### Method Signature (Java)\n```public static int weekdays(int first_month, int first_day, int second_month, int second_day)```\n### Method Signature (Python)\n```def weekdays(first_month, first_day, second_month, second_day):```\n\n### Sample Method Calls (Java)\n`weekdays(2, 3, 4, 5);`\nreturns `43`\n\n\n### Sample Method Calls (Python)\n`weekdays(2, 3, 4, 5)`\nreturns `43`\n\n---\n## Testing Your Program from the Console\n### Console Input Format\n* The first line contains the number of test cases, `t`\n* A single line containing the input, `<first_month>/<first_day> <second_month>/<second_day>`.  For example, `2/3 4/5`.\n\n### Assumptions\n* The month number will always be between 1-12\n* The day numbers will be valid for the given months\n* If the second date occurs before the first date, return `0`\n* The entire range is within 2021 (i.e. there are no test cases like `10/23 1/23` since this range occurs in two different years)\n\n### Console Output Format\n* A single integer with the number of weekdays between two dates in 2021 \n\n### Sample Run\n\n#### Input:\n\n```\n1\n4/15 4/21\n```\n\n#### Output:\n```\n4\n```",
    id: "F",
    solutions: [
        {
            file_name: "Weekdays.py",
            language: "python",
            source: "def weekdays(first_month, first_day, second_month, second_day):\n    \"\"\"\n    Find the number of weekdays between 2 dates in 2021. Include the first\n      date but not the second.\n    :type first_month: int\n    :type first_day: int\n    :type second_month: int\n    :type second_day: int\n    :rtype: int\n    \"\"\"\n\n    # JAN 1, 2021 is a Friday\n    # Here are the number of days in each month:\n    month_list = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]\n\n    WEEKEND = (2, 3)\n\n    first_date = 0\n    second_date = 0\n    num_weekdays = 0\n\n    #get num days for date 1 since epoch\n    for i in range(first_month - 1):\n        first_date += month_list[i]\n    first_date += first_day\n\n    #get num days for date 2 since epoch\n    for i in range(second_month - 1):\n        second_date += month_list[i]\n    second_date += second_day\n\n    # get num days between date 1 and date 2\n    days_between = second_date - first_date\n\n    # for each full week between, add 5 to num_weekdays\n    while (days_between >= 7):\n        num_weekdays += 5\n        days_between -= 7\n\n    # for remaining days, determine what days are weekdays and add them to num_weekdays\n    while (days_between > 0):\n        if first_date % 7 not in WEEKEND:\n            # when the date is not a saturday or sunday\n            num_weekdays += 1\n        days_between -= 1\n        first_date += 1\n\n    return num_weekdays\n\ndef main():\n    for _ in range(int(input())):\n        text = input()\n        dates = text.split(' ')\n        \n        firstEntry = dates[0].split('/')\n        secondEntry = dates[1].split('/')\n\n        first_month = int(firstEntry[0])\n        first_day = int(firstEntry[1])\n        second_month = int(secondEntry[0])\n        second_day = int(secondEntry[1])\n\n        print(weekdays(first_month, first_day, second_month, second_day))\n\nmain()\n"
        },
        {
            file_name: "Weekdays.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class Weekdays {\n\n    public static int weekdays(int first_month, int first_day, int second_month, int second_day)\n    {\n        // JAN 1, 2021 is a Friday\n        // Here are the number of days in each month:\n        int[] month_list = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };\n\n        int[] WEEKEND = { 2, 3 };\n\n        int first_date = 0;\n        int second_date = 0;\n        int num_weekdays = 0;\n\n        //get num days for date 1 since epoch\n        for (int i = 0; i < first_month - 1; i++)\n            first_date += month_list[i];\n        first_date += first_day;\n\n        //get num days for date 2 since epoch\n        for (int i = 0; i < second_month - 1; i++)\n            second_date += month_list[i];\n        second_date += second_day;\n\n        //get num days between date 1 and date 2\n        int days_between = second_date - first_date;\n\n        //for each full week between, add 5 to num_weekdays\n        while (days_between >= 7) {\n            num_weekdays += 5;\n            days_between -= 7;\n        }\n\n        //for remaining days, determine what days are weekdays and add them to num_weekdays\n        while (days_between > 0) {\n            if (first_date % 7 != WEEKEND[0] && first_date % 7 != WEEKEND[1])\n                num_weekdays += 1;\n            days_between--;\n            first_date++;\n        }\n\n        return num_weekdays;\n    }\n\n    /*\n     * It is unnecessary to edit the \"main\" method of each problem's provided code\n     * skeleton. The main method is written for you in order to help you conform to\n     * input and output formatting requirements.\n     */\n    public static void main(String[] args) {\n\n        Scanner in = new Scanner(System.in);\n\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            String text = in.nextLine();\n            String[] dates = text.split(\" \");\n\n            String[] firstEntry = dates[0].split(\"/\");\n            String[] secondEntry = dates[1].split(\"/\");\n            \n            int first_month = Integer.parseInt(firstEntry[0]);\n            int first_day = Integer.parseInt(firstEntry[1]);\n            int second_month = Integer.parseInt(secondEntry[0]);\n            int second_day = Integer.parseInt(secondEntry[1]);\n\n            System.out.println(weekdays(first_month, first_day, second_month, second_day));\n        }\n\n        in.close();\n    }\n}\n"
        }
    ],
    name: "Weekdays",
    skeletons: [
        {
            file_name: "Weekdays.py",
            language: "python",
            source: "\"\"\"\nTODO: Find the number of weekdays between two dates in 2021 given the following parameters:\n\nParameters:\nfirst_month --> (integer) the month number of the first date (1 = January, 2 = February, ..., 12 = December)\nfirst_day --> (integer) the day number of the first date (1, 2, 3, ...)\nsecond_month --> (integer) the month number of the second date (1 = January, 2 = February, ..., 12 = December)\nsecond_day --> (integer) the day number of the second date (1, 2, 3, ...)\n\nReturns:\nan integer representing the number of days between the two dates\n\nNote: Include the first date in your count (if it's a weekday) but not the second date.\n\"\"\"\ndef weekdays(first_month, first_day, second_month, second_day):\n    # Here is the number of days in each month:\n    month_list = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]\n    \n    # Write your solution here\n\n    return 0\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    for _ in range(int(input())):\n        text = input()\n        dates = text.split(' ')\n        \n        firstEntry = dates[0].split('/')\n        secondEntry = dates[1].split('/')\n\n        first_month = int(firstEntry[0])\n        first_day = int(firstEntry[1])\n        second_month = int(secondEntry[0])\n        second_day = int(secondEntry[1])\n\n        print(weekdays(first_month, first_day, second_month, second_day))\n\nmain()\n"
        },
        {
            file_name: "Weekdays.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class Weekdays {\n\n    /**\n    * TODO: Find the number of weekdays between two dates in 2021 given the following parameters:\n    * \n    * @param first_month --> (integer) the month number of the first date (1 = January, 2 = February, ..., 12 = December)\n    * @param first_day --> (integer) the day number of the first date (1, 2, 3, ...)\n    * @param second_month --> (integer) the month number of the second date (1 = January, 2 = February, ..., 12 = December)\n    * @param second_day --> (integer) the day number of the second date (1, 2, 3, ...)\n    *\n    * @return an integer representing the number of days between the two dates\n    *\n    * Note: Include the first date in your count (if it's a weekday) but not the second date.\n    */\n    public static int weekdays(int first_month, int first_day, int second_month, int second_day)\n    {\n        // Here is the number of days in each month:\n        int[] month_list = { 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };\n\n        // Write your solution here\n\n        return 0;\n    }\n\n    /*\n     * It is unnecessary to edit the \"main\" method of each problem's provided code\n     * skeleton. The main method is written for you in order to help you conform to\n     * input and output formatting requirements.\n     */\n    public static void main(String[] args) {\n\n        Scanner in = new Scanner(System.in);\n\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            String text = in.nextLine();\n            String[] dates = text.split(\" \");\n\n            String[] firstEntry = dates[0].split(\"/\");\n            String[] secondEntry = dates[1].split(\"/\");\n            \n            int first_month = Integer.parseInt(firstEntry[0]);\n            int first_day = Integer.parseInt(firstEntry[1]);\n            int second_month = Integer.parseInt(secondEntry[0]);\n            int second_day = Integer.parseInt(secondEntry[1]);\n\n            System.out.println(weekdays(first_month, first_day, second_month, second_day));\n        }\n\n        in.close();\n    }\n}\n"
        }
    ],
    division: "blue"
})

db.problem.insert({
    tests: [
        {
            in: "2\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,2,2,2,0,0,0\n0,0,0,1,2,3,2,0,0,0\n0,0,0,1,1,2,2,0,0,0\n0,0,0,1,0,0,0,0,0,0\n0,0,0,1,1,0,0,0,0,0\n0,0,0,0,1,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,1,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0",
            out: "True\nFalse"
        },
        {
            in: "2\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,2,2,2,0,0,0\n0,0,0,1,2,3,2,0,0,0\n0,0,0,1,1,2,2,0,0,0\n0,0,0,1,0,0,0,0,0,0\n0,2,0,1,1,0,0,0,0,0\n0,2,0,0,1,0,0,0,0,0\n0,2,2,0,0,0,0,0,0,0\n0,0,2,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,2,2,2,0,0,0\n0,0,0,1,2,3,2,0,0,0\n0,0,0,1,1,2,2,0,0,0\n0,0,0,1,0,0,0,0,0,0\n0,0,0,1,1,0,0,0,0,0\n0,0,0,0,1,0,0,0,0,0\n0,0,0,0,0,3,0,0,0,0\n0,0,3,3,3,3,0,0,0,0\n0,0,0,0,0,0,0,0,0,0",
            include: false,
            out: "False\nFalse"
        },
        {
            in: "3\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,2,2,2,0,0,0\n0,0,0,1,2,3,2,0,0,0\n0,0,0,1,1,3,2,0,0,0\n0,0,0,1,0,3,3,3,0,0\n0,1,1,1,1,3,0,0,0,0\n0,1,1,1,1,3,0,0,0,0\n0,1,0,0,0,3,0,0,0,0\n1,1,3,3,3,3,3,3,3,3\n1,1,0,0,0,0,0,0,0,0\n0,0,0,0,2,2,2,2,2,2\n1,0,0,0,2,2,2,0,0,2\n1,0,0,1,2,3,2,0,0,2\n1,1,1,1,1,3,2,2,2,2\n0,0,0,1,0,3,3,3,3,2\n0,1,1,1,1,3,0,0,3,2\n0,1,1,1,1,3,3,3,3,2\n0,1,0,0,0,3,0,0,3,2\n1,1,3,3,3,3,3,3,3,3\n1,1,0,0,0,0,0,0,3,0\n1,1,1,2,2,2,0,0,0,0\n0,1,0,1,2,2,2,0,3,3\n1,1,1,1,2,3,2,0,3,3\n0,0,0,1,1,3,2,0,3,3\n0,0,0,1,3,3,3,3,0,3\n0,1,1,1,1,3,0,0,0,3\n0,1,1,1,1,3,0,0,0,3\n0,1,0,0,0,3,0,0,0,0\n1,1,3,3,3,3,3,3,3,3\n1,1,1,1,1,1,1,1,1,1",
            include: false,
            out: "True\nTrue\nFalse"
        }
    ],
    pid: "5ed2cc0adf3f44e2bc2edd05f228c129",
    description: "### Problem Description\n\nRecently, the City of Xinu passed a law that limits uses for specific plots in the city (cities generally restrict how the land can be used, called zoning).  In the same law, the mayor decided that in order for a new subdivision to be valid, all zones of the same type must be touching.  He has given you a proposed grid of the new subdivision.  Your job is to determine if the grid complies with the requirement that all zones of the same type must be touching.  The grid is filled with integers which represent each zone: `1` = Residential, `2` = Commercial, and `3` = Industrial.  `0` represents an empty plot.  The empty plots do not need to be touching.\n\nTo solve this problem, **write a program that determines if all zones of the same type are touching.**\n\n---\n## Writing Your Solution\nEnter your solution in the body of this method in the given code skeleton:\n\n### Method Signature (Java)\n```public static boolean isValidCityGrid(int[][] grid)```\n### Method Signature (Python)\n```def isValidCityGrid(grid):```\n\n### Sample Method Calls (Java)\n```\nisValidCityGrid(new int[] { new int[] { 0, 3, 3, 3, 3, 3, 0, 0, 0, 0 }, \n                            new int[] { 0, 2, 1, 0, 0, 3, 3, 3, 0, 0 },\n                            new int[] { 0, 2, 1, 0, 0, 0, 0, 3, 0, 0 },\n                            new int[] { 0, 2, 1, 0, 0, 0, 0, 3, 0, 0 },\n                            new int[] { 0, 2, 1, 1, 1, 0, 0, 3, 0, 0 },\n                            new int[] { 0, 2, 0, 0, 1, 0, 0, 3, 0, 0 },\n                            new int[] { 0, 2, 0, 0, 1, 0, 0, 3, 0, 0 },\n                            new int[] { 0, 2, 2, 2, 1, 0, 0, 3, 0, 0 },\n                            new int[] { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },\n                            new int[] { 0, 0, 0, 0, 1, 0, 0, 0, 0, 0 },\n                          });\n```\nreturns `true`\n\n\n### Sample Method Calls (Python)\n```\nisValidCityGrid([[0, 3, 3, 3, 3, 3, 0, 0, 0, 0 ], \n                 [0, 2, 1, 0, 0, 3, 3, 3, 0, 0 ],\n                 [0, 2, 1, 0, 0, 0, 0, 3, 0, 0 ],\n                 [0, 2, 1, 0, 0, 0, 0, 3, 0, 0 ],\n                 [0, 2, 1, 1, 1, 0, 0, 3, 0, 0 ],\n                 [0, 2, 0, 0, 1, 0, 0, 3, 0, 0 ],\n                 [0, 2, 0, 0, 1, 0, 0, 3, 0, 0 ],\n                 [0, 2, 2, 2, 1, 0, 0, 3, 0, 0 ],\n                 [0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ],\n                 [0, 0, 0, 0, 1, 0, 0, 0, 0, 0 ]])\n```\nreturns `true`\n\n---\n## Testing Your Program from the Console\n### Console Input Format\n* The first line contains the number of test cases, `t`\n* For each test, 10 lines with 10 integers separated by a comma\n\n### Assumptions\n* The grid will only be filled with integers 0, 1, 2, or 3.\n* The grid is always 10 x 10\n* Zones that are diagonal from another zone are **not** considered adjacent\n* A zone may not appear at all in the grid\n\n### Console Output Format\n* For each test, a single line with either \"True\" or \"False\"\n\n### Sample Run\n\n#### Input:\n\n```\n2\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,2,2,2,0,0,0\n0,0,0,1,2,2,2,0,0,0\n0,0,0,1,1,2,2,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,1,1,0,3,0,0,0\n0,0,0,0,1,0,3,0,0,0\n0,0,0,0,0,0,3,0,0,0\n0,0,3,3,3,3,3,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,0,0,0,0,0,0\n0,0,0,0,2,2,2,3,3,0\n0,0,0,0,2,2,2,3,3,0\n0,0,0,0,0,2,2,3,3,0\n0,0,0,1,0,0,0,0,3,0\n0,0,0,1,1,0,3,0,3,0\n0,0,0,0,1,0,3,0,3,0\n0,0,0,0,0,0,3,0,3,0\n0,0,3,3,3,3,3,3,3,0\n0,0,0,0,0,0,0,0,0,0\n```\n\n#### Output:\n```\nFalse\nTrue\n```\n",
    id: "G",
    solutions: [
        {
            file_name: "City_Grid.py",
            language: "python",
            source: "def isValidCityGrid(grid):\n    \"\"\"\n    TODO: Determine if a city grid is valid given the following parameters:\n\n    Parameters:\n    grid --> A 10x10 two-dimensional array filled with integer values: 0, 1, 2, or 3.\n\n    Returns:\n    a boolean: True if the city grid is valid. Otherwise, False.\n\n    Note: The grid will only be filled with the integers 0, 1, 2, or 3.  The size of the grid will always be 10 by 10.\n    \"\"\"\n\n    return checkForValidZone(grid, 1) and checkForValidZone(grid, 2) and checkForValidZone(grid, 3)\n\ndef findFirstOccuranceInArray(grid, zone):\n    for row in range(10):\n        for col in range(10):\n            if(grid[row][col] == zone):\n                return (row, col)\n    \n    return (-1, -1)\n\ndef recursivelyReplace(oldElement, newElement, grid, row, col):\n    if(grid[row][col] != oldElement):\n        return\n    \n    grid[row][col] = newElement\n\n    if(row > 0):\n        recursivelyReplace(oldElement, newElement, grid, row-1, col)\n    if(row < 9):\n        recursivelyReplace(oldElement, newElement, grid, row+1, col)\n    if(col > 0):\n        recursivelyReplace(oldElement, newElement, grid, row, col-1)\n    if(col < 9):\n        recursivelyReplace(oldElement, newElement, grid, row, col+1)\n\ndef checkForValidZone(grid, zoneNumber):\n    (firstOneRow, firstOneCol) = findFirstOccuranceInArray(grid, zoneNumber)\n    if(firstOneRow != -1 and firstOneCol != -1):\n        recursivelyReplace(zoneNumber, zoneNumber+3, grid, firstOneRow, firstOneCol)\n    else:\n        return True\n\n    (firstOneRow, firstOneCol) = findFirstOccuranceInArray(grid, zoneNumber)\n    return firstOneRow == -1 and firstOneCol == -1\n\ndef main():\n    for _ in range(int(input())):\n        grid = [[0 for _ in range(10)] for _ in range(10)]\n        for row in range(10):\n            inp = input().split(\",\")\n            for col in range(10):\n                grid[row][col] = int(inp[col])\n\n        result = isValidCityGrid(grid)\n\n        if(result == True):\n            print(\"True\")\n        else:\n            print(\"False\")\n\nmain()"
        },
        {
            file_name: "CityGrid.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class CityGrid {\n\n    public static boolean isValidCityGrid(int[][] grid){\n        /*\n        TODO: Determine if a city grid is valid given the following parameters:\n        \n        Parameters:\n        grid --> A 10x10 two-dimensional int array filled with integer values: 0, 1, 2, or 3.\n        Returns:\n        a boolean: True if the city grid is valid. Otherwise, false.\n        Note: The grid will only be filled with the integers 0, 1, 2, or 3.  The size of the grid will always be 10 by 10.\n        */\n\n        return checkForZone(grid, 1) && checkForZone(grid, 2) && checkForZone(grid, 3);\n    }\n\n    public static int[] findFirstOccurance(int[][] grid, int zone){\n        for (int row = 0; row < 10; row++)\n            for (int col = 0; col < 10; col++)\n                if(grid[row][col] == zone)\n                    return new int[] { row, col };\n\n        return new int[] { -1, -1 };\n    }\n\n    public static void recursivelyReplace(int oldElement, int newElement, int[][] grid, int row, int col){\n        if(grid[row][col] != oldElement)\n            return;\n        \n        grid[row][col] = newElement;\n\n        if(row > 0)\n            recursivelyReplace(oldElement, newElement, grid, row-1, col);\n        if(row < 9)\n            recursivelyReplace(oldElement, newElement, grid, row+1, col);\n        if(col > 0)\n            recursivelyReplace(oldElement, newElement, grid, row, col-1);\n        if(col < 9)\n            recursivelyReplace(oldElement, newElement, grid, row, col+1);\n    }\n\n    public static boolean checkForZone(int[][] grid, int zoneNumber){\n        int[] firstOccurance = findFirstOccurance(grid, zoneNumber);\n        if(firstOccurance[0] != -1 && firstOccurance[1] != -1)\n            recursivelyReplace(zoneNumber, zoneNumber+3, grid, firstOccurance[0], firstOccurance[1]);\n        else\n            return true;\n\n        firstOccurance = findFirstOccurance(grid, zoneNumber);\n        return firstOccurance[0] == -1 && firstOccurance[1] == -1;\n    }\n\n    public static void main(String[] args) {\n\t\tScanner in = new Scanner(System.in);\n\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            int[][] grid = new int[10][10];\n\n            for (int row = 0; row < 10; row++) {\n                String str = in.next();\n                String[] s = str.split(\",\");\n                \n                for (int col = 0; col < 10; col++)\n                    grid[row][col] = Integer.parseInt(s[col]);\n            }\n            \n            boolean result = isValidCityGrid(grid);\n\n            if(result)\n                System.out.println(\"True\");\n            else\n                System.out.println(\"False\");\n        }\n\t\t\n        in.close();\n\t}\n}"
        }
    ],
    name: "City Grid",
    skeletons: [
        {
            file_name: "City_Grid.py",
            language: "python",
            source: "\"\"\"\nTODO: Determine if a city grid is valid given the following parameters:\n\nParameters:\ngrid --> A 10x10 two-dimensional array filled with integer values: 0, 1, 2, or 3.\n\nReturns:\na boolean: True if the city grid is valid. Otherwise, False.\n\nNote: The grid will only be filled with the integers 0, 1, 2, or 3.  The size of the grid will always be 10 by 10.\n\"\"\"\ndef isValidCityGrid(grid):\n\n    # Write your solution here\n\n    return False\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    for _ in range(int(input())):\n        grid = [[0 for _ in range(10)] for _ in range(10)]\n        for row in range(10):\n            inp = input().split(\",\")\n            for col in range(10):\n                grid[row][col] = int(inp[col])\n\n        result = isValidCityGrid(grid)\n\n        if(result == True):\n            print(\"True\")\n        else:\n            print(\"False\")\n\nmain()"
        },
        {
            file_name: "CityGrid.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class CityGrid {\n\n   /*\n    * TODO: Determine if a city grid is valid given the following parameters:\n    *\n    * Parameters:\n    * grid --> A 10x10 two-dimensional int array filled with integer values: 0, 1, 2, or 3.\n    * \n    * Returns:\n    * a boolean: True if the city grid is valid. Otherwise, false.\n    * \n    * Note: The grid will only be filled with the integers 0, 1, 2, or 3.  The size of the grid will always be 10 by 10.\n    */\n    public static boolean isValidCityGrid(int[][] grid){\n\n        // Write your solution here\n\n        return false;\n    }\n\n    // It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n    // The main function is written for you in order to help you conform to input and output formatting requirements.\n    public static void main(String[] args) {\n\t\tScanner in = new Scanner(System.in);\n\n        for (int tests = Integer.parseInt(in.nextLine()); tests > 0; tests--) {\n            int[][] grid = new int[10][10];\n\n            for (int row = 0; row < 10; row++) {\n                String str = in.next();\n                String[] s = str.split(\",\");\n                \n                for (int col = 0; col < 10; col++)\n                    grid[row][col] = Integer.parseInt(s[col]);\n            }\n            \n            boolean result = isValidCityGrid(grid);\n\n            if(result)\n                System.out.println(\"True\");\n            else\n                System.out.println(\"False\");\n        }\n\t\t\n        in.close();\n\t}\n}"
        }
    ],
    division: "blue"
})

db.problem.insert({
    tests: [
        {
            in: "3\n11 13 415b2d793b6e\n7 19 1a05212476560580337680585b0d2481600a80586f760b0d0a\n5 29 203d2b2b8d89578d272b05548914688d5b2f0d",
            out: "Ahoya!\nWelcome to Abacus! Ahoya!\nHello World, Ahoya!"
        },
        {
            in: "2\n11 19 b6106c086c6db60a6c727f6dc1736d7f10186dca176c7f916da410170b6c8f\n13 17 c69ebea50f883880cfba0fcf680e628d0f9c6880249e32",
            include: false,
            out: "Shaka Smart is the goat. Ahoya!\nJack wrote this. Ahoya!"
        },
        {
            in: "2\n5 29 89744987734970427474871470498e76744229496e631047765c\n11 23 fa045f5f07a43445a4564389a4a27c5fa4305f0f4fa1a4157c43f20f84\n",
            include: false,
            out: "It is getting late. Ahoya!\nSleep is for the weak. Ahoya!"
        }
    ],
    pid: "f779e4ffc7184cb5a889c3d6a7eb53a4",
    description: "You and your friend Bard are huge Marquette Basketball fans. The two of you have gone to every game this season, and you always match your outfits to stand out and make it on the Jumbotron. Your friend Bard, being a computer science major, loves to encrypt all his messages using RSA encryption.\n\nHe explained to you he generated a pair of unique numbers _e_ and _d_ such that messages he encrypts with the value _e_ can only be decrypted using the value _d_. He gave you the value _d_, erased it from his machine, and said to keep it private. He urged you not to lose _d_ because you are the only one who has it and there is no backup.\n\nYou won't see Bard till the game on Saturday, but you just got your phone repaired, and remembered to back up your messages to the cloud, but forgot to save the value of _d_.\n\n### Problem Description\n\nWithout _d_ you can not decrypt any of his messages and don't know what you are supposed to wear for the game this Saturday. But you remember Bard ends all his message with `Ahoya!`\n\nYou do some research and find that _e_ and _d_ were generated using two unique prime numbers _p_ and _q_ and the following algorithm.\n\n1. Calculate _n = p &times; q_.\n2. Calculate _&phi;(n) = (p-1) &times; (q-1)_.\n3. Select integer _e_ such that _gcd(&phi;(n), e) = 1; 1 &lt; e &lt; &phi;(n)_.\n4. Calculate _d_ where _(d &times; e) mod(&phi;(n)) = 1_.\n\nWith _M_ representing the plaintext (unencrypted text), and _C_ being the ciphertext (encrypted text).\n\nUsing _e_, you can encrypt messages with: _C = M<sup>e</sup> (mod n)_\n\nUsing _d_, you can decrypt messages with: _M = C<sup>d</sup> (mod n)_\n\nTo solve this problem, **write a program that uses _p_, _q_, and _ciphertext_ to generate possible plaintexts and returns the plaintext that ends in Ahoya!**\n\n### Writing Your Solution\n\nYou will be provided _ciphertext_ in the form of an `int` array where each element represents a character. To encrypt/decrypt the ciphertext apply the corresponding algorithms on each element of the array.\n\nTo convert the `int` array representation of cipher/plain text to a `String` representation use the provided `decode()` function.\n\nEnter your solution in the body of the following method in the given code skeleton\n\n> #### Java Programmers\n>\n> We have provided the `gcd(int a, int b)` function for you to use.\n>\n> Also, some of the numbers used in encrypting and decrypting are too big for the primitive **int** and **long** datatypes, so we provided the function `powMod(int b, int e, int m)` which performs _b<sup>e</sup> (mod m)_\n\n### Method Signature\n\n- `p` and `q` are used in the RSA Algorithm described above.\n- `c` is an `int` array representation of the ciphertext.\n\n#### Java\n\n`public static String codebreak(int p, int q, int[] c)`\n\n#### Python\n\n`def codebreak(p, q, c)`\n\n### Sample Method Call\n\n#### Java\n\n`codebreak(13, 17, new int[]{ 156, 104, 128, 36, 158, 50})`\nreturns `Ahoya!`\n\n#### Python\n\n`codebreak(13 17 [156, 104, 128, 36, 158, 50])`\nreturns `Ahoya!`\n\n## Testing Your Program from the Console\n\n### Console Input Format\n\n- the first line contains the number of test cases, `t`\n- for each test case, the following three input parameters appear on a line, space-separated:\n  - `p`: integer value for `p`\n  - `q`: integer value for `q`\n  - `cipherhex`: The ciphertext array represented as a hex string (this is taken care of by the skeletons main method)\n\n### Console Output Format\n\n- For each test, a single line with the plaintext.\n\n### Assumptions\n\n- 1 < `p` < 100\n- 1 < `q` < 100\n- 0 < `e` < 200\n- 0 < `d` < 200\n- Every test case has a corresponding plaintext\n\n### Sample Run\n\n#### Input:\n\n```\n1\n13 17 9c6880249e32\n```\n\n#### Output:\n\n```\nAhoya!\n```\n\n### Sample Run Explanation\n\nThe sample run contains 1 test case (`t` = 1):\n\n- The hextext `9c6880249e32` encrypted using `p = 13` and `q = 17` and unknown value _e_ is **`Ahoya!`** in plaintext.\n\n  - The main method will translate `9c6880249e32` to an integer array [`156`, `104`, `128`, `36`, `158`, `50`] to pass to _codebreak_.\n\n  - _codebreak_ should determine that when `e = 7` and the calculated value `d = 103` the following will be true.\n\n    - Applying the decrypt algorithm on [`156`, `104`, `128`, `36`, `158`, `50`] using `d = 103` and the provided `p=13` and `q=17` values will become [`65`, `104`, `111`, `121`, `97`, `33`]\n\n    - Passing the array [`65`, `104`, `111`, `121`, `97`, `33`] to `decode()` will return the text `Ahoya!`\n\n  - Because `codebreak` was able to find a set of `e` and `d` such that the decrypted text contains `Ahoya!` it can return the text `Ahoya!`\n",
    id: "H",
    solutions: [
        {
            file_name: "The_Missing_Key.py",
            language: "python",
            source: "import math\n\ndef decode(text):\n    return \"\".join(chr(c) for c in text)\n\ndef codebreak(p, q, ciphertext):\n    n = p*q\n    phi = (p-1)*(q-1)\n\n    for e in range(2, phi):\n        if math.gcd(e, phi) == 1:\n            for d in range(phi):\n                if (d * e) % phi == 1:\n                    plaintext = decode((c**d) % n for c in ciphertext)\n                    if \"Ahoya!\" in plaintext:\n                        return plaintext\n    return None\n\n\ndef main():\n    for _ in range(int(input())):\n        inp = input().split(\" \")\n\n        p = int(inp[0])\n        q = int(inp[1])\n        m = [int(inp[2][i:i+2], 16) for i in range(0, len(inp[2]), 2)]\n\n        print(codebreak(p, q, m))\n\n\nmain()"
        },
        {
            file_name: "TheMissingKey.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class TheMissingKey {\n    public static int gcd(int a, int b) {\n        if (b == 0)\n            return a;\n        return gcd(b, a % b);\n    }\n\n    public static int powMod(int b, int e, int m) {\n        return java.math.BigInteger.valueOf(b).modPow(java.math.BigInteger.valueOf(e), java.math.BigInteger.valueOf(m))\n                .intValue();\n    }\n\n    public static String decode(int[] message) {\n        return java.util.Arrays.stream(message).mapToObj(i -> Character.toString((char) i))\n                .collect(java.util.stream.Collectors.joining());\n    }\n\n    public static String codebreak(int p, int q, int[] m) {\n        int n = p * q;\n        int phi = (p - 1) * (q - 1);\n        for (int e = 2; e < phi; e++) {\n            if (gcd(e, phi) == 1) {\n                for (int d = 0; d < phi; d++) {\n                    if ((d * e) % phi == 1) {\n                        int[] plainint = new int[m.length];\n                        for (int i = 0; i < m.length; i++) {\n                            plainint[i] = powMod(m[i], d, n);\n                        }\n                        String plaintext = decode(plainint);\n                        if (plaintext.contains(\"Ahoya!\")) {\n                            return plaintext;\n                        }\n                    }\n                }\n            }\n        }\n        return null;\n    }\n\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n\n        for (int tests = in.nextInt(); tests > 0; tests--) {\n            int p = in.nextInt();\n            int q = in.nextInt();\n\n            int[] c = java.util.Arrays.stream(in.next().split(\"(?<=\\\\G..)\")).mapToInt(s -> Integer.parseInt(s, 16))\n                    .toArray();\n\n            System.out.println(codebreak(p, q, c));\n        }\n        in.close();\n    }\n}"
        }
    ],
    name: "The Missing Key",
    skeletons: [
        {
            file_name: "The_Missing_Key.py",
            language: "python",
            source: "import math\n\n\ndef decode(text):\n    return \"\".join(chr(c) for c in text)\n\n\n\"\"\"TODO: Complete this method that finds a plaintext containing \"Ahoya!\" using the given args:\nArgs:\n    p (int): p-value from the algorithm.\n    q (int): q-value from the algorithm.\n    ciphertext (int[]): ciphertext represented as an array of integers\nReturns:\n    string - decoded plaintext as a string\n\"\"\"\ndef codebreak(p, q, ciphertext):\n    \n    # Write your code here\n\n    return None\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    for _ in range(int(input())):\n        inp = input().split(\" \")\n\n        p = int(inp[0])\n        q = int(inp[1])\n        m = [int(inp[2][i:i+2], 16) for i in range(0, len(inp[2]), 2)]\n\n        print(codebreak(p, q, m))\n\n\nmain()"
        },
        {
            file_name: "TheMissingKey.java",
            language: "java",
            source: "import java.util.Scanner;\n\npublic class TheMissingKey {\n    public static int gcd(int a, int b) {\n        if (b == 0)\n            return a;\n        return gcd(b, a % b);\n    }\n\n    public static int powMod(int b, int e, int m) {\n        return java.math.BigInteger.valueOf(b).modPow(java.math.BigInteger.valueOf(e), java.math.BigInteger.valueOf(m))\n                .intValue();\n    }\n\n    public static String decode(int[] message) {\n        return java.util.Arrays.stream(message).mapToObj(i -> Character.toString((char) i))\n                .collect(java.util.stream.Collectors.joining());\n    }\n\n    /**\n     * Complete this method that finds a plaintext containing \"Ahoya!\"\n     * \n     * @param p          --> p-value from the algorithm.\n     * @param q          --> q-value from the algorithm.\n     * @param ciphertext --> ciphertext represented as an array of integers\n     * \n     * @return {string} - decoded plaintext as a string\n     */\n    public static String codebreak(int p, int q, int[] m) {\n        \n        // Write your code here\n\n        return null;\n    }\n\n    /*\n    * It is unnecessary to edit the \"main\" method of each problem's provided code\n    * skeleton. The main method is written for you in order to help you conform to\n    * input and output formatting requirements.\n    */\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n\n        for (int tests = in.nextInt(); tests > 0; tests--) {\n            int p = in.nextInt();\n            int q = in.nextInt();\n\n            int[] c = java.util.Arrays.stream(in.next().split(\"(?<=\\\\G..)\")).mapToInt(s -> Integer.parseInt(s, 16))\n                    .toArray();\n\n            System.out.println(codebreak(p, q, c));\n        }\n        in.close();\n    }\n}"
        }
    ],
    division: "blue"
})

db.problem.insert({
    tests: [
        {
            in: "2\n6\n10\n0.5\n10\n20\n0.25",
            out: "0.20508\n0.00992"
        },
        {
            in: "2\n200\n220\n0.9\n70\n80\n0.9",
            include: false,
            out: "0.08398\n0.10317"
        },
        {
            in: "2\n5\n10\n0.1\n45\n67\n0.78",
            include: false,
            out: "0.00149\n0.01291"
        }
    ],
    pid: "1e22edd2ac0545b9a5ea4f508a537cce",
    description: "### Problem Description\n\nDennis is working at a major aerospace company planning multiple trips to send people to live on Mars.  Sometimes, one of these missions has to be aborted due to bad landing conditions on Mars. Dennis has been working on a method to find the statistical probability of multiple successful missions to Mars. His superiors have asked him to find the probability of `x` success over `n` tries given a `p`% landing rate for the brave crew. Write a function to calculate this probability.\n\nTo find the chance of exactly `x` number of successes, we can use the binomial distribution.The binomial distribution can be thought of as the probability of an `x` success in an experiment that is occurring `n` times with each success having a probability of `p`.\n\nTo solve this problem, **write a program that computes the probability using the binomial distribution given x, n, and p.**\n\n>Note: In Java, you may find it helpful to use the BigDecimal API. Documentation for the BigDecimal API can be found [here](https://docs.oracle.com/javase/8/docs/api/java/math/BigDecimal.html).\n\n>Note: In Python, you may find it helpful to use the Decimal API. Documentation for the Decimal API can be found [here](https://docs.python.org/3/library/decimal.html)\n\n---\n## Writing Your Solution\nEnter your solution in the body of this method in the given code skeleton:\n\n### Method Signature (Java)\n```public static BigDecimal binomial(int x, int n, double p)```\n### Method Signature (Python)\n```def binomial(x, n, p):```\n\n### Sample Method Calls (Java)\n`binomial(6, 10, 0.5)`\nreturns `0.20508`\n\n\n### Sample Method Calls (Python)\n`binomial(6, 10, 0.5)`\nreturns `0.20508`\n\n---\n## Testing Your Program from the Console\n### Console Input Format\n* The first line contains the number of test cases, `t`\n* For each test, the first line represents `x`, the second line represents `n`, and the third line represents `p`\n\n### Assumptions\n* `x` > 0\n* `n` > 0\n* `x` < `n`\n* 1 > `p` > 0\n\n### Console Output Format\n* For each test, a single line with the output truncated to 5 decimal places\n\n### Sample Run\n\n#### Input:\n```\n2\n6 \n10 \n0.5\n10\n20\n0.25\n```\n\n#### Output:\n```\n0.20508\n0.00992\n```",
    id: "I",
    solutions: [
        {
            file_name: "A_Harrowing_Expedition.py",
            language: "python",
            source: "import decimal \n\"\"\"\nTODO: calculate the probability of exactly x successes given n trials with probability of p given the following parameters:\n\nx --> (integer) number of successes \nn --> (integer) number of trials\np --> (float) probability of success\n\nReturns:\na Decimal containing the probability of exactly x successes out of n trials with a probability of p\n\nNote: In Python, you may find it helpful to use the Decimal API.  Documentation for the Decimal API can be found here: https://docs.python.org/3/library/decimal.html\n\n\"\"\"\ndef binomial(x, n, p):\n    nChooseRNumerator = decimal.Decimal('1')\n    nChooseRDenominator = decimal.Decimal('1')\n\n    counter=n\n    while(counter > (n-x)):\n        nChooseRNumerator = nChooseRNumerator * counter\n        counter=counter-1\n    counter=x\n    while(counter > 0):\n        nChooseRDenominator = nChooseRDenominator * counter\n        counter=counter-1\n    nChooseR = decimal.Decimal('1')\n    nChooseR =  nChooseRNumerator / nChooseRDenominator\n    successes = pow(p, x)\n    failures = pow(1 - p, n - x)\n    result = nChooseR * decimal.Decimal(successes)\n    result = result * decimal.Decimal(failures)\n\n    return result\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    for _ in range(int(input())):\n        # User Input #\n        x = int(input())\n        n = int(input())\n        p = float(input())\n\n        # Function Call\n        result = binomial(x, n, p)\n\n        # Terminal Output #\n        print(float(\"{:.5f}\".format(result)))\n\nmain()"
        },
        {
            file_name: "AHarrowingExpedition.java",
            language: "java",
            source: "import java.math.BigDecimal;\nimport java.util.Scanner;\n\npublic class AHarrowingExpedition {\n\t\n\tpublic static BigDecimal binomial(int x, int n, double p) {\n\t\tBigDecimal nChooseRNumerator = new BigDecimal(\"1\");\n\t\tBigDecimal nChooseRDenominator = new BigDecimal(\"1\");\n\t\tfor (int i = n; i > (n - x); i--) {\n\t\t\tnChooseRNumerator = nChooseRNumerator.multiply(BigDecimal.valueOf(i));\n\t\t}\n\t\tfor (int i = x; i > 0; i--) {\n\t\t\tnChooseRDenominator = nChooseRDenominator.multiply(BigDecimal.valueOf(i));\n\t\t}\n\t\tBigDecimal nChooseR = nChooseRNumerator.divide(nChooseRDenominator);\n\t\tdouble successes = Math.pow(p, x);\n\t\tdouble failures = Math.pow(1 - p, n - x);\n\t\tBigDecimal result = nChooseR.multiply(BigDecimal.valueOf(successes));\n\t\tresult = result.multiply(BigDecimal.valueOf(failures));\n\t\treturn result;\n\t}\n\t\n\tpublic static void main(String[] args) {\n\t\tScanner in = new Scanner(System.in);\n\n        int cases = in.nextInt();\n        for (; cases > 0; cases--) {\n\t\t\t// User Input\n            int x = in.nextInt();\n            int n = in.nextInt();\n\t\t\tdouble p = in.nextDouble();\n\n            // Function Call\n            BigDecimal returnedVal = binomial(x, n, p);\n\n\t\t\t// Output\n\t\t\tSystem.out.printf(\"%.5f\\n\", returnedVal);\n\t\n\t\t}\n\t}\n}\n"
        }
    ],
    name: "A Harrowing Expedition",
    skeletons: [
        {
            file_name: "A_Harrowing_Expedition.py",
            language: "python",
            source: "\"\"\"\nTODO: calculate the probability of exactly x successes given n trials with probability of p given the following parameters:\n\nx --> (integer) number of successes \nn --> (integer) number of trials\np --> (float) probability of success\n\nReturns:\na Decimal containing the probability of exactly x successes out of n trials with a probability of p\n\nNote: In Python, you may find it helpful to use the Decimal API.  Documentation for the Decimal API can be found here: https://docs.python.org/3/library/decimal.html\n\n\"\"\"\ndef binomial(x, n, p):\n\n    # Write your solution here\n\n    return 0\n\n# It is unnecessary to edit the \"main\" function of each problem's provided code skeleton.\n# The main function is written for you in order to help you conform to input and output formatting requirements.\ndef main():\n    for _ in range(int(input())):\n        # User Input #\n        x = int(input())\n        n = int(input())\n        p = float(input())\n\n        # Function Call\n        result = binomial(x, n, p)\n\n        # Terminal Output #\n        print(float(\"{:.5f}\".format(result)))\n\nmain()"
        },
        {
            file_name: "AHarrowingExpedition.java",
            language: "java",
            source: "import java.math.BigDecimal;\nimport java.util.Scanner;\n\npublic class AHarrowingExpedition {\n\n    /**\n    * TODO: calculate the probability of exactly x successes given n trials with probability of p given the following parameters:\n    * \n    * Note: Documentation for the BigDecimal API can be found here: https://docs.oracle.com/javase/8/docs/api/java/math/BigDecimal.html\n    * \n    * @param x --> (integer) number of successes \n    * @param n --> (integer) number of trials\n    * @param p --> (double) probability of success\n    *\n    * @return new BigDecimal --> a BigDecimal containing the probability of exactly x successes out of n trials with a probability of p\n    */\n    public static BigDecimal binomial(int x, int n, double p) {\n\n        // Write your solution here\n\n        return new BigDecimal(\"1\");\n\t}\n\n    /*\n    * It is unnecessary to edit the \"main\" method of each problem's provided code\n    * skeleton. The main method is written for you in order to help you conform to\n    * input and output formatting requirements.\n    */\n    public static void main(String[] args) {\n\t\tScanner in = new Scanner(System.in);\n\n        int cases = in.nextInt();\n        for (; cases > 0; cases--) {\n\t\t\t// User Input\n            int x = in.nextInt();\n            int n = in.nextInt();\n\t\t\tdouble p = in.nextDouble();\n\n            // Function Call\n            BigDecimal returnedVal = binomial(x, n, p);\n\n\t\t\t// Output\n\t\t\tSystem.out.printf(\"%.5f\\n\", returnedVal);\n\t\n\t\t}\n\t}\n\n}"
        }
    ],
    division: "blue"
})

db.problem.insert({
    practice: true,
    pid: "80c1ebf62556425ca5ea0a07b948b1e2",
    project_id: "514410859",
    description: "### Problem Description\n\nComplete this problem to help us test if the competition software is working for all teams.\n\n> Pay attention to these side-notes in this practice problem. They explain the format of this document, which matches the format of the actual competition problems.\n\n> Problems descriptions end with a problem statement, which summarizes the task:\n\nTo complete this practice problem, **create a game in which when the cat sprite is clicked, it will start moving around the screen randomly. Each time the sprite is clicked it will also decrease in size and re-route its direction to be random**.\n\n> Often times there will be extra clarifications after the problem statement explaining technical details.\n\nYou are given one cat sprite and a galaxy backdrop, but you may change these if you want.",
    id: "PP",
    name: "Practice Problem",
    division: "gold"
})

db.problem.insert({
    pid: "af524b9dc84d4d44946aefe9c1ece24d",
    project_id: "515230222",
    description: "**Objective:** Create a project in which a player can click on food options from a menu, then based on the total the game will calculate the total food cost, then a tip for the server, and finally the total estimated cost that includes the tip.\n\n**Given:** To access the project template click Q1 - Restaurant Tip Generator, click ‘See Inside’, and then click ‘Remix.’ \nThe following features are given in the template:\n\n- Three Backdrops: a restaurant, a menu, and a bill \n\n- Three sprites - a server that will talk, and two other characters that are just for show\n\n- Sprites for the menu that should be clickable - these should add money to the food cost variable as someone clicks each of these sprites\n\n  - Each number sprite will have a cost (you can pick the cost)\n\n  - One of these is the Done button which should exit the menu after clicking food options\n\n- A bill sprite \n- A GameManager Sprite \n    - This sprite is optional - it is invisible and will do the math calculations for you, but this can be done in any other sprite\n\n\n\n**Task:** Adding the following features will earn you the following points:\n\n## Grading Rubric\n\n| No. | Pts. | Feature |\n| :---: | :---: | :---------- |\n| 1 | 2 | The user can click on the numbered menu sprites to choose food items. The numbered menu sprites will add the cost to the food cost variable **only** on clicking. |\n| 2 | 1 | When the user clicks on the numbered menu sprites, the food cost variable will increase by the amount of money that food item costs. |\n| 3 | 1 | The game will easily switch back to the restaurant screen or to be the final bill screen after clicking the **Done** button from the menu backdrop. |\n| 4 | 1 | The total food cost, the 20% tip cost, and the final calculated bill cost is accurately calculated and displayed on the final screen. |\n| 5 | 1 | The game has some dialog from the server. |\n",
    id: "A",
    name: "Restaurant Tip Generator",
    design_document: false,
    max_points: "6",
    division: "gold"
})

db.problem.insert({
    pid: "a667bcdb703c43beac3b229fa058825a",
    project_id: "515235694",
    description: "**Problem 2:** Fibonacci Visual Representation \n\n**Objective: **Use the Scratch “Pen” add-on to create a drawing of a graph that displays numbers based on the Fibonacci equation. To add this add-on, first create a new project. Then at the very bottom left of the screen, there is a button that looks like this:\n\n![](https://i.ibb.co/r7QddjJ/fib1.png)\n\nThen select the pen option:\n\n![](https://i.ibb.co/mbYHCn0/fib2.png)\n\nTake some time to test out the code blocks that come with this pen. \n\n**Given:** To access the project template click Q2 - Fibonacci Graph Template, click ‘See Inside’, and then click ‘Remix’. The following features are given in the template:\nThe code and sprites needed to draw the graph\nThe function stub for calculating the Fibonacci Numbers.\n\nYou will need to write an iterative solution to calculating the Fibonacci numbers and correctly graph your results, like so:\n\n![](https://i.ibb.co/sjWZWtt/fib3.png)\n\n\n>Note: Math background for this problem can be found [here](https://drive.google.com/file/d/1CPb_iy64XntqZsfMm0fYI1zjhIjSDPpx/view?usp=sharing).",
    id: "B",
    name: "Fibonacci Visual Representation",
    division: "gold"
})

db.problem.insert({
    pid: "24e8986bb3d447728154a2cdf5f23e34",
    project_id: "515232676",
    description: "**Problem 3:** Underwater Hangman Game\n\n**Objective: **Create an underwater Hangman game! A main character fish sprite will prompt the user to type in a letter to guess. If the user guesses the correct answer, then move fish towards some end goal sprite - in the template, this is a taco but you can change it. \n\nLet the user know they guessed a correct letter. If the user does not guess correctly, then check to see if the position is the same as when we started; if it is, then do not move fish backward, just decrement the number of turns by one. If the person wins they will reach the end sprite, if they lose the fish will tell them the correct answer.\n\n**Given:** To access the project template click Q3 - Underwater Hangman, click ‘See Inside’, and then click ‘Remix.’ \nThe following features are given in the template:\n\n- One underwater backdrop\n- Two sprites\n- One fish that should be coded with most of the functionality \n- One end goal sprite - the given is a taco but you can change this\n\nSome variables and list variables to get you started\n\n- Variables\n   - Word - the current word that must be guessed\n\n   - Wordlength - use this to store the length of the word\n\n  - Count this will help you to calculate the length of the word \n\n  - numTurnsthis will help you keep track of how many turns to guess the user has used\n\n\n- Lists\n\n  - LettersGuessed - use this to keep track of the letters that the user has typed in \n\n  - WordBank - use this as a way to pick a random word each time the game is started\n\n**Hints: **\nStart out by trying to get this to work with just one word, and then you can add more later\n\n**Task:** Adding the following features will earn you the following points:\n\n## Grading Rubric\n\n| No. | Pts. | Feature |\n| :---: | :---: | :---------- |\n| 1 | 1 | Create and fill a word bank. Pick a random word from the word bank that will be used for gameplay. |\n| 2 | 1 | Have fish sprite prompt the user to guess a letter and store that letter in a variable. |\n| 3 | 2 | Determine if the guessed letter is present in the word, displaying the letter in its correct position in the word. |\n| 4 | 2 | Move the fish sprite either forward or backward depending on if the guessed letter was correct. |\n| 5 | 1 | Keep track of the turns with a variable, and decrement them accordingly. |\n",
    id: "C",
    name: "Underwater Hangman",
    max_points: "7",
    division: "gold"
})

db.problem.insert({
    pid: "51467b02dd8b4a2dbf3f1ace1e552bfc",
    project_id: "515239298",
    description: "**Problem 4:** Costume Party! (up to 15 points, for a total of 20 combined with Problem 5)\n\n**Objective: **Create a costume party-style game. Use multiple sprites and create multiple costume options for the sprites to wear.\n\n**Task:** Imagine one of your sprites is having a costume birthday party! The sprites should be able to change their costumes in the game, and they could also do other things during this party that you can decide!\n\n\n\n----------\n\n\n\nThings to consider when designing your project:\n\n- How could you have the sprites change costumes during the game?\n- Is there one main character that changes the other sprites costumes?\n- What other party activities should there be in this game?\n- How will you transition between activities?\n- Will there be cake?\n\n\n**Points will be awarded for each notable feature in your program.**\n\n\n\n----------\n\n\n\n**Design Document:** In addition to your Scratch program, submit a short document (typed into the Design Document editor) describing the features of your project. It doesn’t have to be too formal or long - just list the primary ways your user can interact with the project, and describe the features you’re most proud of. Pretend you’re selling your solution - make sure the judges know about all of the features you spent your time on!\n",
    id: "D",
    name: "Costume Party Creative Problem",
    capped_points: true,
    design_document: true,
    max_points: "15",
    division: "gold"
})

db.problem.insert({
    pid: "fbe91ae1c5ba4bc592a37f6372bfa941",
    project_id: "515239739",
    description: "**Problem 5:** A Day at the Ski Resort (up to 15 points, for a total of 20 combined with Problem 5)\n\n**Objective: **Create a scratch game that depicts a day at a ski resort. You are given multiple backdrop options that you can use or add your own. \n\n**Task:** Imagine one of your sprites is having a fun day on the ski slopes. They might meet up with other friends, ski down a hill, go to a restaurant at the resort. Have fun with this one and be creative!\n\n\n----------\n\n\nThings to consider when designing your project:\n\n- How could you show a sprite skiing down a hill?\n- Will your sprite meet up with other friends?\n- How will your sprite navigate to other activities for this game?\n- How could your sprite get onto a ski lift?\n- How will you transition between activities?\n\n\n**Points will be awarded for each notable feature in your program.**\n\n**Design Document:** In addition to your Scratch program, submit a short document (typed into the Design Document editor) describing the features of your project. It doesn’t have to be too formal or long - just list the primary ways your user can interact with the project, and describe the features you’re most proud of. Pretend you’re selling your solution - make sure the judges know about all of the features you spent your time on!",
    id: "E",
    name: "Day at the Ski Resort Creative Problem",
    capped_points: true,
    design_document: true,
    max_points: "15",
    division: "gold"
})

db.problem.insert({
    pid: "d2ebe468995a4584ae303f19ad759a75",
    description: "### Hackathon Prompt\n**Describe a problem in your school community and derive a software-driven solution to solve and/or alleviate the said problem.\n**\n\nYou are highly encouraged to have a workable, programmed solution (or a partial solution). Keep in mind, it is more than okay to be bold with your ideas and only have a simplistic implementation; you will be evaluated holistically.  ",
    id: "A",
    name: "Hackathon Prompt",
    division: "eagle"
})
