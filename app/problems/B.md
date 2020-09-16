
Four high school friends, Jimothy, Clyle, Syrin, and Lemme-Drive-Da-Boat (or "Lemme" for short), have all been dying to go on a big adventure around the world; they call themselves The Four Amigos. Unfortunately, like most high schoolers, they don't have a lot of money. Due to this constraint, they decide to plan a virtual world adventure modeled after the one seen in *Around The World in 80 Days*. They call it **Around The World in 80 Clock Cycles**.

While planning this adventure, Clyle buys a Powerball&reg; ticket in New Berlin, WI. As it turns out, Clyle purchased the winning ticket; he won the $768.4 million jackpot. Because of this new found wealth, he can take himself and all of his friends on a real adventure. They plan their trip and fly to their first country, Iceland.

### Problem Description

Jimothy, Clyle, and Syrin have arrived in a foreign country. Lemme had boating practice, so he has to take a later flight and is meeting everyone there; he needs to be picked up at the airport. They are staying at a hotel without WiFi, so they cannot track Lemme's flight. Jimothy says he knows the distance from Milwaukee to Reykjavik, Iceland. Syrin says she knows, on average, how fast the plane is going. With this knowledge, The Four Amigos want to figure out what time Lemme will land so they can know by when they should be at the airport.

To solve this problem, **write a program that takes in a depature time and velocity and returns the arrival time of the flight.**

* You do not need to account for time of day signifiers (AM or PM).
* You do not need to account for time change between time zones.
* Use the simple physics equation `distance = velocity * time` to perform the calculations.
* Round the resulting arrival time down to the nearest minute.

## Writing Your Solution

Enter your solution in the body of this method in the given code skeleton:

### Method Signature

#### Java

```public static int[] totalFlightTime(int distance, int velocity, int departureHr, int departureMin)```

 - Return an `int` array containing `{arrivalHr, arrivalMin}`

#### Python

```def totalFlightName(distance, velocity, departureHr, departureMin):```

 - Return a tuple containing `(arrivalHr, arrivalMin)`

### Sample Method Calls

#### Java

`totalFlightTime(300, 200, 7, 30)`
returns an `int` array containing `{9, 0}`

#### Python

`totalFlightTime(300, 200, 7, 30)`
returns `(9, 0)`

## Testing Your Program from the Console

### Console Input Format

* the first line contains the number of test cases, `t`
* for each test case, the following four input integers appear on a line, space-separated:
  * `distance`: the distance, in miles, of the flight
  * `velocity`: the velocity, in miles per hour, of the plane
  * `departureHr`: the hour in which the flight departs
  * `departureMin`: the minute in which the flight departs

### Console Output Format

* for each test, a single line with the arrival time, formatted `arrivalHr:arrivalMin`
  * `arrivalHr` should have no leading zeros, e.g., `1:45` should not be formatted `01:45`

### Assumptions

* `t` is the number of test cases
* 0 <= `distance` <= 5000
* 100 <= `velocity` <= 600
* 1 <= `departureHr` <= 12
* 0 <= `departureMin` <= 59
* 1 <= `arrivalHr` <= 24, and the hour will not "wrap" around into the next day
* 0 <= `arrivalMin` <= 59

### Sample Run

#### Input:

```
3
300 200 7 30
1000 450 10 16
10 600 1 0
```

#### Output:

```
9:00
12:29
1:01
```

### Sample Run Explanation

The sample run contains 3 test cases (`t` = 3):
* A flight with a distance of **300** miles, flying at **200** mph, departing at **7:30**, will arrive at **9:00**
* A flight with a distance of **1000** miles, flying at **450** mph, departing at **10:16**, will arrive at **12:29**.
* A flight with a distance of **10** miles, flying at **600** mph, departing at **1:00**, will arrive at **1:01**
