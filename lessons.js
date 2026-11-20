const course = [
  {
    title: 'Getting started',
    lessons: [
      {
        id: 'first-script',
        title: 'Your first script',
        time: 5,
        intro: 'Save a command in a .ps1 file and run it from PowerShell. You can edit and rerun the same file whenever you want.',
        setup: true,
        notes: [
          'A script is a text file containing commands. Save the example as hello.ps1 in your practice folder.',
          'Write-Output sends a value to PowerShell’s output. Here, the value is the text inside the quotes.',
          'In PowerShell, run ./hello.ps1 from the practice folder. The ./ tells PowerShell to look in the current folder.',
        ],
        file: 'hello.ps1',
        example: 'Write-Output "Hello, PowerShell!"',
        exampleOutput: 'Hello, PowerShell!',
        task: 'Change the message to “I wrote a script!” Save the file and run ./hello.ps1 again.',
        expected: 'I wrote a script!',
        hint: 'Keep Write-Output and the quotation marks. Change the text between the quotes.',
        solution: 'Write-Output "I wrote a script!"',
        question: 'Why do you type ./ before hello.ps1?',
        choices: ['It runs every script in the folder.', 'It points to a file in the current folder.', 'It changes the extension to .ps1.'],
        correct: 1,
        feedback: 'Think about where you saved hello.ps1.',
        explanation: './hello.ps1 tells PowerShell exactly where to find the script.',
      },
      {
        id: 'variables',
        title: 'Variables',
        time: 5,
        intro: 'Store a value once, then refer to it by name.',
        notes: [
          'PowerShell variable names start with $. The = sign assigns the value on the right to the name on the left.',
          'A later assignment replaces the earlier value. Each Write-Output uses the value stored when that line runs.',
        ],
        file: 'variables.ps1',
        example: `$city = "Denver"
Write-Output $city
$city = "Seattle"
Write-Output $city`,
        exampleOutput: 'Denver\nSeattle',
        task: 'Create a variable named $pet. Store “cat” and print it, then change the same variable to “dog” and print it again.',
        expected: 'cat\ndog',
        hint: 'Follow the example’s order: assign, print, assign again, print again.',
        solution: `$pet = "cat"
Write-Output $pet
$pet = "dog"
Write-Output $pet`,
        question: 'What does the second Write-Output in the example print?',
        choices: ['Denver', '$city', 'Seattle'],
        correct: 2,
        feedback: 'Read the assignments and output commands from top to bottom.',
        explanation: 'The second assignment updates $city before the second print.',
      },
      {
        id: 'strings',
        title: 'Text and quotes',
        time: 6,
        intro: 'Build a message by inserting a variable into a string.',
        notes: [
          'A string is a piece of text. In double quotes, PowerShell inserts the value of a variable into the string.',
          'In single quotes, PowerShell usually keeps the characters as written. Compare the two lines of output below.',
        ],
        file: 'strings.ps1',
        example: `$name = "Avery"
Write-Output "Hello, $name!"
Write-Output 'Hello, $name!'`,
        exampleOutput: 'Hello, Avery!\nHello, $name!',
        task: 'Store “Oslo” in $city and use that variable in a message that prints “Next stop: Oslo.”',
        expected: 'Next stop: Oslo.',
        hint: 'Use double quotes around the whole message. The terminal output should include the period.',
        solution: `$city = "Oslo"
Write-Output "Next stop: $city."`,
        question: 'What do you change to make the last line of the example print Avery?',
        choices: ['Use double quotes.', 'Remove the dollar sign.', 'Add a second dollar sign.'],
        correct: 0,
        feedback: 'Compare how the two kinds of quotes treat $name.',
        explanation: 'Double quotes expand $name into its current value.',
      },
      {
        id: 'numbers',
        title: 'Numbers and math',
        time: 6,
        intro: 'Use variables to calculate a result before printing it.',
        notes: [
          'Write numbers such as 4 without quotes so PowerShell treats them as numbers. Use + to add and * to multiply.',
          'Calculate the total on its own line. You can insert the result into a double-quoted string like any other variable.',
        ],
        file: 'numbers.ps1',
        example: `$boxes = 3
$itemsPerBox = 4
$total = $boxes * $itemsPerBox
Write-Output "Total items: $total"`,
        exampleOutput: 'Total items: 12',
        task: 'Change the script to count items in 5 boxes with 6 items in each box. Use the calculation to get the total.',
        expected: 'Total items: 30',
        hint: 'Change the two values at the top. Keep the multiplication line.',
        solution: `$boxes = 5
$itemsPerBox = 6
$total = $boxes * $itemsPerBox
Write-Output "Total items: $total"`,
        question: 'What does "3" + "4" produce?',
        choices: ['7', '34', '12'],
        correct: 1,
        feedback: 'Look at the quotes around both values.',
        explanation: 'The quotes make both values strings. With two strings, + joins their text.',
      },
    ],
  },
  {
    title: 'Decisions and repetition',
    lessons: [
      {
        id: 'input',
        title: 'Ask for input',
        time: 6,
        intro: 'Let the person running your script supply a value.',
        notes: [
          'Read-Host displays a prompt and waits for a line of text. The assignment stores what the person types after they press Enter.',
          'The prompt and the result are separate. You can run the same script twice and type a different answer each time.',
        ],
        file: 'input.ps1',
        example: `$name = Read-Host "What is your name?"
Write-Output "Hello, $name!"`,
        exampleOutput: 'What is your name?: Avery\nHello, Avery!',
        task: 'Ask “What is your favorite color?” and reply “You picked blue.” when someone types blue. Rerun it and try another color.',
        expected: 'What is your favorite color?: blue\nYou picked blue.',
        hint: 'Store the result of Read-Host in $color, then use $color in the reply.',
        solution: `$color = Read-Host "What is your favorite color?"
Write-Output "You picked $color."`,
        question: 'What does $name contain after you type Avery and press Enter?',
        choices: ['The prompt text', 'The entire greeting', 'The text Avery'],
        correct: 2,
        feedback: 'Separate the question on screen from the answer you type.',
        explanation: 'Read-Host returns the answer, which the assignment stores in $name.',
      },
      {
        id: 'conditions',
        title: 'Make a decision',
        time: 8,
        intro: 'Use if and else to choose which lines run.',
        notes: [
          'The expression in parentheses is the condition. The -ge operator means “greater than or equal to.” Use -eq to compare for equality.',
          'If the condition is true, PowerShell runs the first block inside braces. If it is false, PowerShell runs the else block instead.',
        ],
        file: 'decisions.ps1',
        example: `$score = 7
if ($score -ge 5) {
    Write-Output "Goal reached."
} else {
    Write-Output "Keep practicing."
}`,
        exampleOutput: 'Goal reached.',
        task: 'Make a script that prints “Full box.” for 10 or more items and “Room left.” otherwise. Test it with 9 and 10.',
        expected: 'Room left.\nFull box.',
        expectedLabel: 'Expected output across two runs, first 9 then 10',
        hint: 'Change the variable to $items and compare it with 10 using -ge.',
        solution: `$items = 9
if ($items -ge 10) {
    Write-Output "Full box."
} else {
    Write-Output "Room left."
}
# Run again with $items = 10 on the first line.`,
        question: 'Which branch runs if $score is exactly 5 in the example?',
        choices: ['The if block', 'The else block', 'Both blocks'],
        correct: 0,
        feedback: 'Read -ge as greater than or equal to.',
        explanation: '-ge includes equality, so a score of 5 makes the condition true.',
      },
      {
        id: 'arrays',
        title: 'Keep a list',
        time: 7,
        intro: 'Use an array to store several values together.',
        notes: [
          '@(...) creates an array. Use commas between its items.',
          'An index in brackets picks one item. The first index is 0, and .Count tells you how many items there are.',
        ],
        file: 'lists.ps1',
        example: `$fruit = @("apple", "pear", "plum")
Write-Output $fruit[0]
Write-Output $fruit.Count`,
        exampleOutput: 'apple\n3',
        task: 'Create a list containing “red”, “green”, and “blue”. Print the second item, then print the item count.',
        expected: 'green\n3',
        hint: 'The second item is at index 1.',
        solution: `$colors = @("red", "green", "blue")
Write-Output $colors[1]
Write-Output $colors.Count`,
        question: 'Which expression retrieves plum from the example?',
        choices: ['$fruit[3]', '$fruit[2]', '$fruit.Count'],
        correct: 1,
        feedback: 'Start counting the indexes at zero.',
        explanation: 'The three items use indexes 0, 1, and 2.',
      },
      {
        id: 'loops',
        title: 'Repeat for each item',
        time: 8,
        intro: 'Use foreach to do the same work for every item in a list.',
        notes: [
          'In foreach ($fruit in $fruits), $fruits is the list and $fruit holds one item at a time.',
          'PowerShell runs the block once per item, in order. Use the singular variable inside the block to work with the current item.',
        ],
        file: 'loops.ps1',
        example: `$fruits = @("apple", "pear", "plum")
foreach ($fruit in $fruits) {
    Write-Output "Pack one $fruit."
}`,
        exampleOutput: 'Pack one apple.\nPack one pear.\nPack one plum.',
        task: 'Loop through “read”, “code”, and “review”. Print each on a separate line with “Next: ” before it.',
        expected: 'Next: read\nNext: code\nNext: review',
        hint: 'Create a $tasks array and use foreach ($task in $tasks).',
        solution: `$tasks = @("read", "code", "review")
foreach ($task in $tasks) {
    Write-Output "Next: $task"
}`,
        question: 'What is $fruit on the second pass through the example loop?',
        choices: ['apple', 'plum', 'pear'],
        correct: 2,
        feedback: 'Follow the fruit list from left to right.',
        explanation: 'The loop visits apple first, then pear, then plum.',
      },
    ],
  },
  {
    title: 'Useful scripts',
    lessons: [
      {
        id: 'pipeline',
        title: 'Connect commands',
        time: 8,
        intro: 'Send the output of one command to another with a pipeline.',
        notes: [
          'The | character passes values along the pipeline. PowerShell can pass numbers and other objects as well as text.',
          'Read this example from left to right. The list goes to Sort-Object, and Select-Object -First 1 keeps the first result after sorting.',
        ],
        file: 'pipeline.ps1',
        example: `$scores = @(8, 2, 5)
$scores | Sort-Object | Select-Object -First 1`,
        exampleOutput: '2',
        task: 'Print the two highest scores from the same list, highest first.',
        expected: '8\n5',
        hint: 'Add -Descending to Sort-Object and pass 2 to -First.',
        solution: `$scores = @(8, 2, 5)
$scores | Sort-Object -Descending | Select-Object -First 2`,
        question: 'What makes Select-Object receive the sorted list?',
        choices: ['The pipe after Sort-Object', 'The commas inside the array', 'The -First parameter'],
        correct: 0,
        feedback: 'Look for the character that connects the two commands.',
        explanation: 'The pipe hands the output of Sort-Object to Select-Object.',
      },
      {
        id: 'functions',
        title: 'Reuse code with functions',
        time: 9,
        intro: 'Give a block of code a name and call it with different values.',
        notes: [
          'The function block defines Get-Double. Its param block declares $number as a parameter that callers can fill in.',
          'The lines after the definition call the function. The multiplication expression sends the result to PowerShell’s output.',
        ],
        file: 'functions.ps1',
        example: `function Get-Double {
    param($number)
    $number * 2
}

Get-Double -Number 4
Get-Double -Number 7`,
        exampleOutput: '8\n14',
        task: 'Write a Get-Triple function. Call it with 3 and 5.',
        expected: '9\n15',
        hint: 'Keep the parameter name $number. Change the function name and the multiplier.',
        solution: `function Get-Triple {
    param($number)
    $number * 3
}

Get-Triple -Number 3
Get-Triple -Number 5`,
        question: 'Which part supplies the value 7 to the function in the example?',
        choices: ['param($number)', 'Get-Double -Number 7', '$number * 2'],
        correct: 1,
        feedback: 'Look for the line that pairs -Number with 7.',
        explanation: '-Number 7 passes a value into the declared $number parameter for that call.',
      },
      {
        id: 'files',
        title: 'Write a text file',
        time: 9,
        intro: 'Save a list in a text file and read it back.',
        notes: [
          'Set-Content writes the values to a file. Use a new filename in your practice folder because it replaces any content already at that path.',
          'Get-Content reads the file as lines of text. The ./ at the start of the path means the current folder, just as it did when you ran your first script.',
        ],
        file: 'files.ps1',
        example: `$lines = @("Learn variables", "Try a loop")
Set-Content -LiteralPath "./practice-notes.txt" -Value $lines
Get-Content -LiteralPath "./practice-notes.txt"`,
        exampleOutput: 'Learn variables\nTry a loop',
        task: 'Save the lines “Buy apples” and “Buy rice” to a new file called practice-shopping.txt. Print the file’s contents with Get-Content.',
        expected: 'Buy apples\nBuy rice',
        hint: 'Change the two values in the array and use the same new path in both commands.',
        solution: `$lines = @("Buy apples", "Buy rice")
Set-Content -LiteralPath "./practice-shopping.txt" -Value $lines
Get-Content -LiteralPath "./practice-shopping.txt"`,
        question: 'Which command displays the saved lines?',
        choices: ['Set-Content', '-LiteralPath', 'Get-Content'],
        correct: 2,
        feedback: 'Look for the command that reads the file.',
        explanation: 'Set-Content writes the file. Get-Content reads it and emits the lines.',
      },
      {
        id: 'project',
        title: 'Project: score report',
        time: 15,
        intro: 'Put loops, conditions, and files together in a small report you can run again with new data.',
        notes: [
          'Start with the number list and print each score to check your loop. Then set the label inside the loop using an if block.',
          'Build the report in memory first. In $lines = foreach (...), the output of the loop is collected into $lines. Once it looks right, save it and read it back.',
        ],
        file: 'score-report.ps1',
        example: `$scores = @(8, 3, 5)
$lines = foreach ($score in $scores) {
    "Score $score"
}
Write-Output $lines`,
        exampleOutput: 'Score 8\nScore 3\nScore 5',
        task: 'Add “- pass” to scores of 5 or higher and “- retry” to the others. Save the report to practice-score-report.txt, then read it back to check it.',
        expected: 'Score 8 - pass\nScore 3 - retry\nScore 5 - pass',
        hint: 'Set $label in both branches of an if/else inside the loop. Emit one string per score, then use Set-Content and Get-Content after the loop.',
        solution: `$scores = @(8, 3, 5)
$lines = foreach ($score in $scores) {
    if ($score -ge 5) {
        $label = "pass"
    } else {
        $label = "retry"
    }
    "Score $score - $label"
}
Set-Content -LiteralPath "./practice-score-report.txt" -Value $lines
Get-Content -LiteralPath "./practice-score-report.txt"`,
        question: 'Where should Set-Content go so it writes the whole report once?',
        choices: ['After the loop', 'Inside the if block', 'Before the loop'],
        correct: 0,
        feedback: 'Think about when $lines contains every score.',
        explanation: 'After the loop, $lines contains a report line for every score.',
      },
    ],
  },
];
