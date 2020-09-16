
### Problem Description

Complete this problem to help us test if the competition software is working for all teams.

> Pay attention to these side-notes in this practice problem. They explain the format of this document, which matches the format of the actual competition problems.

> Problems descriptions end with a problem statement, which summarizes the task:

To complete this practice problem, **write a program that returns whether or not a given value is negative**.

 > Often times there will be extra clarifications after the problem statement explaining technical details.

For this problem, zero is considered non-negative. The program should indicate as such.

---
## Writing Your Solution

> For each problem, we provide a code "skeleton": a pre-made Java or Python program that handles the parsing and printing of program input and output (through the console). Simply edit the indicated method in the pre-made skeleton to solve the problem, and leave the rest of the skeleton unchanged.

> You are not required to use the code skeletons, but it is highly recommended. Each problem has strict input and output format requirements, and these skeletons can help you conform to those requirements.

Enter your solution in the body of this method in the given code skeleton:

### Method Signature

#### Java

```public static boolean isNegative(int input)```

#### Python

```def isNegative(input):```

### Sample Method Calls

#### Java

`isNegative(-3)`
returns boolean value `true`

`isNegative(12)`
return boolean value `false`

#### Python

`isNegative(-3)`
returns boolean value `True`

`isNegative(12)`
returns boolean value `False`

---

## Testing Your Program from the Console

> When you are done writing your program, you can test it out by entering input into the console in the format described in this section. This is the format that we will use and expect when we test your solution.

### Console Input Format

* the first input line contains, `t`, the number of tests
> Most problems will input multiple test cases during a single run of the program.
* then, for each test, a single line containing the input number to check, `x`

### Assumptions

> Our test data (used to judge your solution) will *always* adhere to the assumptions listed in this section of each problem.

* 1 <= `t` <= 10
* -1000 <= `x` <= 1000
  * A value of `x` equal to zero is valid input; when `x` = 0, the program should output that `x` is non-negative

### Console Output Format

* for each test, output a single line. Print "Negative" if `x` is negative, otherwise print "Non-Negative"

### Sample Run

> Every test provides a sample set of input and expected output. When you run your completed program, typing in the data under "Input:" should yield the data under "Output:".

> For judging, we use additional test cases, besides those in the Sample Runs. Pay close attention to the "Assumptions" section of each problem, and think of other possible inputs to try out before submitting your solution.

#### Input:

```
4
-3
12
0
-1
```

(4 is `t`, and the following values were different `x` cases)

#### Output:

```
Negative
Non-Negative
Non-Negative
Negative
```