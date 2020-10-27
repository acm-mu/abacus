
The Four Amigos had a phenomenal time in Iceland and have now arrived in Paris, France. They take a train to Lyon, France as it is Syrin's dream to see the Festival of Lights. 

When they arrive in Lyon, it turns out the director for the event has fallen ill with senioritis (it's a real disease). The director tells the committee to pick the first person off the street, and they will become the new director. Fortunately for Syrin, she is standing outside of their office and is chosen to be the new director for the 2019 Festival of Lights!

### Problem Description

Syrin's biggest responsibility is that she is in charge of purchasing the lights. She has been given an instruction set on how the pattern of lights will be displayed. She realizes that she can save money on string lights by buying discounted lights with missing or broken bulbs. All she needs is to figure out how many lights will be on after all instructions in a given instruction set are applied.

Syrin knows that the instructions will be applied to a 100x100 grid of lights, and they will be one of the following operations: `turn on`, `turn off`, or `toggle`. Each instruction will target a specific rectangular section of lights, described by the starting `x-coordinate`, starting `y-coordinate`, `width`, and `height`. Each instruction needs to be performed on every light within the bounds of this rectangular section.

To solve this problem, **finish writing a program that counts the number of lights in a grid which are  turned on after a instructions are applied to the grid.**

All lights in the grid are turned off before the instruction set is executed.

The instructions are given with integer codes: `0` for "turn lights off", `1` for "turn lights on", and `2` for "toggle lights".

## Writing Your Solution

The given code skeleton implements much of the program for you.

You should write the `execute` function of the skeleton to process one instruction at a time. This function should adjust the lights in the two-dimensional array `grid`, setting lights to `0` if they are turned off, or `1` if they are turned on.

The `main` method will run `execute` for each instruction. Then, it runs the provided `count` method to count the number of lights in `grid` which are turned on.

Enter your part of the solution in the body of this method in the given code skeleton:

### Method Signature

#### Java

```public static void execute(int code, int startX, int startY, int width, int height)```

#### Python

```def execute(code, startX, startY, width, height):```

### Sample Method Calls

`execute(1, 0, 0, 10, 10)`

turns all lights in `grid` between (and including) `grid[0][0]` and `grid[9][9]` to `1` (meaning these lights are turned on).

## Testing Your Program from the Console

### Console Input Format

* the first line contains the number of test cases, `t`
* for each test, a line contains `i`, the number of instructions for that test
* for each instruction, a line contains the following five integer inputs, comma-separated: `code`, `startX`, `startY`, `width`, and `height`

### Assumptions

* 0 <= `t` <= 10
* 0 <= `i` <= 5
* 0 <= `code` <= 2
* 0 <= `startX`, `startY`, `width`, `height` <= 100

### Console Output Format

* for each test, a single line with the number of lights on after all instructions are processed

### Sample Run

#### Input:

```
3
1
1,0,0,10,10
2
1,0,0,10,10
0,5,5,5,5
2
1,0,0,10,10
2,0,0,5,5
```

#### Output:

```
100
75
75
```
