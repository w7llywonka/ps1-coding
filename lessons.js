const units = [
  {
    title: 'Script basics',
    goal: 'Start by saving and rerunning one command. Then store a value, insert it into text, and calculate a new value from two numeric inputs. In the challenge, you will change a single quantity and see both receipt lines update.',
    lessons: [
      {
        id: 'first-script',
        title: 'Your first script',
        time: 8,
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
        practice: [
          {
            title: 'Change the greeting',
            task: 'Change the message to “I wrote a script!” Save the file and run ./hello.ps1 again.',
            expected: 'I wrote a script!',
            hint: 'Keep Write-Output and the quotation marks. Change the text between the quotes.',
            solution: 'Write-Output "I wrote a script!"',
          },
          {
            title: 'Print two lines',
            task: 'Write a script that prints “Step one” and “Step two” on separate lines. Swap the two commands and run it again to see how the order changes.',
            expected: 'Step one\nStep two',
            expectedLabel: 'Expected output before swapping the commands',
            hint: 'Give each Write-Output command its own line in the file.',
            solution: `Write-Output "Step one"
Write-Output "Step two"`,
          },
        ],
        question: 'Why do you type ./ before hello.ps1?',
        choices: ['It runs every script in the folder.', 'It points to a file in the current folder.', 'It changes the extension to .ps1.'],
        correct: 1,
        feedback: 'Think about where you saved hello.ps1.',
        explanation: './hello.ps1 tells PowerShell exactly where to find the script.',
      },
      {
        id: 'variables',
        title: 'Variables',
        time: 8,
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
        practice: [
          {
            title: 'Update a variable',
            task: 'Create a variable named $pet. Store “cat” and print it, then change the same variable to “dog” and print it again.',
            expected: 'cat\ndog',
            hint: 'Follow the example’s order: assign, print, assign again, print again.',
            solution: `$pet = "cat"
Write-Output $pet
$pet = "dog"
Write-Output $pet`,
          },
          {
            title: 'Keep a copy of a value',
            review: 'Running commands in order',
            task: 'Store “draft” in $status, then copy it into $previous. Change $status to “ready”. Print $previous, then $status. Use one assignment to copy the value instead of typing “draft” twice.',
            expected: 'draft\nready',
            hint: 'Use $previous = $status while $status still contains “draft”.',
            solution: `$status = "draft"
$previous = $status
$status = "ready"
Write-Output $previous
Write-Output $status`,
          },
        ],
        question: 'What does the second Write-Output in the example print?',
        choices: ['Denver', '$city', 'Seattle'],
        correct: 2,
        feedback: 'Read the assignments and output commands from top to bottom.',
        explanation: 'The second assignment updates $city before the second print.',
      },
      {
        id: 'strings',
        title: 'Text and quotes',
        time: 9,
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
        practice: [
          {
            title: 'Fill in a message',
            task: 'Store “Oslo” in $city and use that variable in a message that prints “Next stop: Oslo.”',
            expected: 'Next stop: Oslo.',
            hint: 'Use double quotes around the whole message. The terminal output should include the period.',
            solution: `$city = "Oslo"
Write-Output "Next stop: $city."`,
          },
          {
            title: 'Show a template and its result',
            review: 'Variables and command order',
            task: 'Store “Mina” in $name and “Go” in $game. Print the literal template “$name plays $game.”, then print the same message with the two values filled in.',
            expected: '$name plays $game.\nMina plays Go.',
            hint: 'Write the same text twice. Use single quotes for the template and double quotes for the filled-in message.',
            solution: `$name = "Mina"
$game = "Go"
Write-Output '$name plays $game.'
Write-Output "$name plays $game."`,
          },
        ],
        question: 'What do you change to make the last line of the example print Avery?',
        choices: ['Use double quotes.', 'Remove the dollar sign.', 'Add a second dollar sign.'],
        correct: 0,
        feedback: 'Compare how the two kinds of quotes treat $name.',
        explanation: 'Double quotes expand $name into its current value.',
      },
      {
        id: 'numbers',
        title: 'Numbers and math',
        time: 9,
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
        practice: [
          {
            title: 'Multiply two values',
            task: 'Change the script to count items in 5 boxes with 6 items in each box. Use the calculation to get the total.',
            expected: 'Total items: 30',
            hint: 'Change the two values at the top. Keep the multiplication line.',
            solution: `$boxes = 5
$itemsPerBox = 6
$total = $boxes * $itemsPerBox
Write-Output "Total items: $total"`,
          },
          {
            title: 'Count packed and loose items',
            review: 'Variables and double-quoted strings',
            task: 'Calculate how many items are in 4 boxes of 6. Add 3 loose items. Print the packed count first, then print the total count. Store both calculations in variables.',
            expected: 'Packed: 24\nTotal: 27',
            hint: 'Multiply for the packed count, then use that result in a second calculation with +.',
            solution: `$boxes = 4
$itemsPerBox = 6
$loose = 3
$packed = $boxes * $itemsPerBox
$total = $packed + $loose
Write-Output "Packed: $packed"
Write-Output "Total: $total"`,
          },
        ],
        question: 'What does "3" + "4" produce?',
        choices: ['7', '34', '12'],
        correct: 1,
        feedback: 'Look at the quotes around both values.',
        explanation: 'The quotes make both values strings. With two strings, + joins their text.',
      },
      {
        id: 'snack-order',
        title: 'Challenge: snack order',
        time: 12,
        intro: 'Write a small receipt using variables, math, and text.',
        file: 'snack-order.ps1',
        challenge: true,
        practice: [
          {
            title: 'Build a receipt',
            review: 'Unit 1 · Variables, math, and double-quoted strings',
            task: 'Store “Granola” as the snack name, 3 as the number of packs, and 4 as the price per pack. Calculate the total and print a line identifying the order and a second line showing the total. Then change only the number of packs to 5 and check that both lines update.',
            expected: 'Granola order: 3 packs\nTotal: 12\n\nGranola order: 5 packs\nTotal: 20',
            expectedLabel: 'Output for 3 packs, then for 5 packs',
            hint: 'Keep the three inputs at the top. Multiply the two numeric variables on a separate line. Use double quotes for both lines of the receipt.',
            solution: `$snack = "Granola"
$packs = 3
$pricePerPack = 4
$total = $packs * $pricePerPack
Write-Output "$snack order: $packs packs"
Write-Output "Total: $total"`,
          },
        ],
      },
    ],
  },
  {
    title: 'Decisions and loops',
    goal: 'Read an answer first, then turn it into a decision with if and else. Arrays let you store several inputs, and a loop applies that decision to each one. You will use all four ideas to count sessions that reach a chosen goal.',
    lessons: [
      {
        id: 'input',
        title: 'Ask for input',
        time: 9,
        intro: 'Let the person running your script supply a value.',
        notes: [
          'Read-Host displays a prompt and waits for a line of text. The assignment stores what the person types after they press Enter.',
          'The prompt and the result are separate. You can run the same script twice and type a different answer each time.',
        ],
        file: 'input.ps1',
        example: `$name = Read-Host "What is your name?"
Write-Output "Hello, $name!"`,
        exampleOutput: 'What is your name?: Avery\nHello, Avery!',
        practice: [
          {
            title: 'Ask one question',
            task: 'Ask “What is your favorite color?” and reply “You picked blue.” when someone types blue. Rerun it and try another color.',
            expected: 'What is your favorite color?: blue\nYou picked blue.',
            hint: 'Store the result of Read-Host in $color, then use $color in the reply.',
            solution: `$color = Read-Host "What is your favorite color?"
Write-Output "You picked $color."`,
          },
          {
            title: 'Ask two questions',
            review: 'Unit 1 · Variables and double-quoted strings',
            task: 'Ask for a name and a hobby with two Read-Host commands. Combine both answers into one sentence. Try the sample answers, then run the script again with your own.',
            expected: 'Name: Riley\nHobby: chess\nRiley likes chess.',
            hint: 'Save each Read-Host result in its own variable. Both variable names can go in the same double-quoted string.',
            solution: `$name = Read-Host "Name"
$hobby = Read-Host "Hobby"
Write-Output "$name likes $hobby."`,
          },
        ],
        question: 'What does $name contain after you type Avery and press Enter?',
        choices: ['The prompt text', 'The entire greeting', 'The text Avery'],
        correct: 2,
        feedback: 'Separate the question on screen from the answer you type.',
        explanation: 'Read-Host returns the answer, which the assignment stores in $name.',
      },
      {
        id: 'conditions',
        title: 'Make a decision',
        time: 11,
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
        practice: [
          {
            title: 'Check a number against a limit',
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
          },
          {
            title: 'Choose a message from the answer',
            review: 'Unit 1 · Variables and strings. Unit 2 · Input.',
            task: 'Ask “Mode (study or break)”. If the answer is study, print “Open your notes.” Otherwise, print “Take five minutes.” Run it once with study and once with break.',
            expected: 'Mode (study or break): study\nOpen your notes.\n\nMode (study or break): break\nTake five minutes.',
            expectedLabel: 'Two runs separated by a blank line',
            hint: 'Save the Read-Host result, then compare it to "study" with -eq in the if condition.',
            solution: `$mode = Read-Host "Mode (study or break)"
if ($mode -eq "study") {
    Write-Output "Open your notes."
} else {
    Write-Output "Take five minutes."
}`,
          },
        ],
        question: 'Which branch runs if $score is exactly 5 in the example?',
        choices: ['The if block', 'The else block', 'Both blocks'],
        correct: 0,
        feedback: 'Read -ge as greater than or equal to.',
        explanation: '-ge includes equality, so a score of 5 makes the condition true.',
      },
      {
        id: 'arrays',
        title: 'Keep a list',
        time: 10,
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
        practice: [
          {
            title: 'Read one item from an array',
            task: 'Create a list containing “red”, “green”, and “blue”. Print the second item, then print the item count.',
            expected: 'green\n3',
            hint: 'The second item is at index 1.',
            solution: `$colors = @("red", "green", "blue")
Write-Output $colors[1]
Write-Output $colors.Count`,
          },
          {
            title: 'Pick from a list',
            review: 'Unit 1 · Strings. Unit 2 · Input and conditions.',
            task: 'Store “tea” and “juice” in an array. Ask “Pick 1 or 2”. Use if/else to assign the first item for answer 1 and the second item for answer 2. Print the chosen drink in a sentence. Test with both choices and assume the input is valid.',
            expected: 'Pick 1 or 2: 1\nYou picked tea.\n\nPick 1 or 2: 2\nYou picked juice.',
            expectedLabel: 'Two runs separated by a blank line',
            hint: 'Compare the answer to the text "1". Assign a variable from index 0 in the if block and index 1 in the else block.',
            solution: `$drinks = @("tea", "juice")
$answer = Read-Host "Pick 1 or 2"
if ($answer -eq "1") {
    $drink = $drinks[0]
} else {
    $drink = $drinks[1]
}
Write-Output "You picked $drink."`,
          },
        ],
        question: 'Which expression retrieves plum from the example?',
        choices: ['$fruit[3]', '$fruit[2]', '$fruit.Count'],
        correct: 1,
        feedback: 'Start counting the indexes at zero.',
        explanation: 'The three items use indexes 0, 1, and 2.',
      },
      {
        id: 'loops',
        title: 'Repeat for each item',
        time: 11,
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
        practice: [
          {
            title: 'Print every item',
            task: 'Loop through “read”, “code”, and “review”. Print each on a separate line with “Next: ” before it.',
            expected: 'Next: read\nNext: code\nNext: review',
            hint: 'Create a $tasks array and use foreach ($task in $tasks).',
            solution: `$tasks = @("read", "code", "review")
foreach ($task in $tasks) {
    Write-Output "Next: $task"
}`,
          },
          {
            title: 'Count scores that meet a goal',
            review: 'Unit 1 · Addition and strings. Unit 2 · Arrays and conditions.',
            task: 'Loop through 3, 5, 7, and 2. Count scores of 5 or higher, then print the count once after the loop. Change the first score from 3 to 6 and make sure the count increases.',
            expected: 'Goals met: 2\nGoals met: 3',
            expectedLabel: 'Output from the original run, then the edited run',
            hint: 'Start the count at 0 before foreach. Inside the loop, add 1 only if the current score is at least 5.',
            solution: `$scores = @(3, 5, 7, 2)
$count = 0
foreach ($score in $scores) {
    if ($score -ge 5) {
        $count = $count + 1
    }
}
Write-Output "Goals met: $count"`,
          },
        ],
        question: 'What is $fruit on the second pass through the example loop?',
        choices: ['apple', 'plum', 'pear'],
        correct: 2,
        feedback: 'Follow the fruit list from left to right.',
        explanation: 'The loop visits apple first, then pear, then plum.',
      },
      {
        id: 'study-goal',
        title: 'Challenge: study goal',
        time: 15,
        intro: 'Check several study sessions against a goal chosen by the learner.',
        file: 'study-goal.ps1',
        challenge: true,
        practice: [
          {
            title: 'Count sessions that meet the goal',
            review: 'Unit 2 · Input, arrays, conditions, and loops. Unit 1 · Addition and strings.',
            task: 'Ask for a goal of “short” or “long”. A short goal is 15 minutes and a long goal is 25 minutes. Check sessions of 10, 15, and 25 minutes in a loop. Print each session as “met” if it reached the goal or “keep going” if it fell short. Print the number of sessions that met the goal after the loop. Test both goals with valid input.',
            expected: 'Goal (short or long): short\n10 minutes - keep going\n15 minutes - met\n25 minutes - met\nSessions that met the goal: 2\n\nGoal (short or long): long\n10 minutes - keep going\n15 minutes - keep going\n25 minutes - met\nSessions that met the goal: 1',
            expectedLabel: 'Two runs separated by a blank line',
            hint: 'Use one if/else before the loop to pick the goal in minutes. Use another if/else inside the loop to label each session and add 1 to the count when it meets the goal.',
            solution: `$goal = Read-Host "Goal (short or long)"
if ($goal -eq "short") {
    $targetMinutes = 15
} else {
    $targetMinutes = 25
}

$sessions = @(10, 15, 25)
$met = 0
foreach ($minutes in $sessions) {
    if ($minutes -ge $targetMinutes) {
        Write-Output "$minutes minutes - met"
        $met = $met + 1
    } else {
        Write-Output "$minutes minutes - keep going"
    }
}
Write-Output "Sessions that met the goal: $met"`,
          },
        ],
      },
    ],
  },
  {
    title: 'Reusable scripts and reports',
    goal: 'Pass a list through a pipeline that sorts and selects values. Move a calculation into a function so it can run for every input, then send the formatted results to a text file that you can read back.',
    lessons: [
      {
        id: 'pipeline',
        title: 'Connect commands',
        time: 11,
        intro: 'Send the output of one command to another with a pipeline.',
        notes: [
          'The | character passes values along the pipeline. PowerShell can pass numbers and other objects as well as text.',
          'Read this example from left to right. The list goes to Sort-Object, and Select-Object -First 1 keeps the first result after sorting.',
        ],
        file: 'pipeline.ps1',
        example: `$scores = @(8, 2, 5)
$scores | Sort-Object | Select-Object -First 1`,
        exampleOutput: '2',
        practice: [
          {
            title: 'Select the two highest values',
            task: 'Print the two highest scores from the same list, highest first.',
            expected: '8\n5',
            hint: 'Add -Descending to Sort-Object and pass 2 to -First.',
            solution: `$scores = @(8, 2, 5)
$scores | Sort-Object -Descending | Select-Object -First 2`,
          },
          {
            title: 'Label the top results',
            review: 'Unit 1 · Strings. Unit 2 · Arrays and foreach.',
            task: 'Store 4, 9, 2, and 7 in an array. Use a pipeline to save the two highest values, then loop over only those results to print a label for each one.',
            expected: 'Top score: 9\nTop score: 7',
            hint: 'Assign the whole pipeline to $topScores. Use foreach on $topScores after that line.',
            solution: `$scores = @(4, 9, 2, 7)
$topScores = $scores | Sort-Object -Descending | Select-Object -First 2
foreach ($score in $topScores) {
    Write-Output "Top score: $score"
}`,
          },
        ],
        question: 'What makes Select-Object receive the sorted list?',
        choices: ['The pipe after Sort-Object', 'The commas inside the array', 'The -First parameter'],
        correct: 0,
        feedback: 'Look for the character that connects the two commands.',
        explanation: 'The pipe hands the output of Sort-Object to Select-Object.',
      },
      {
        id: 'functions',
        title: 'Reuse code with functions',
        time: 12,
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
        practice: [
          {
            title: 'Write a function with one parameter',
            task: 'Write a Get-Triple function. Call it with 3 and 5.',
            expected: '9\n15',
            hint: 'Keep the parameter name $number. Change the function name and the multiplier.',
            solution: `function Get-Triple {
    param($number)
    $number * 3
}

Get-Triple -Number 3
Get-Triple -Number 5`,
          },
          {
            title: 'Call a function inside a loop',
            review: 'Unit 1 · Math and strings. Unit 2 · Arrays and foreach.',
            task: 'Write a function called Get-TicketCost that takes a ticket count and returns the cost at 4 per ticket. Loop over 2, 3, and 5 tickets. Call your function each time and print the count and cost together.',
            expected: '2 tickets cost 8\n3 tickets cost 12\n5 tickets cost 20',
            hint: 'Declare one parameter with param($count). In the loop, save the output of Get-TicketCost -Count $count in a variable before printing.',
            solution: `function Get-TicketCost {
    param($count)
    $count * 4
}

$counts = @(2, 3, 5)
foreach ($count in $counts) {
    $cost = Get-TicketCost -Count $count
    Write-Output "$count tickets cost $cost"
}`,
          },
        ],
        question: 'Which part supplies the value 7 to the function in the example?',
        choices: ['param($number)', 'Get-Double -Number 7', '$number * 2'],
        correct: 1,
        feedback: 'Look for the line that pairs -Number with 7.',
        explanation: '-Number 7 passes a value into the declared $number parameter for that call.',
      },
      {
        id: 'files',
        title: 'Write a text file',
        time: 12,
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
        practice: [
          {
            title: 'Write and read two lines',
            task: 'Save the lines “Buy apples” and “Buy rice” to a new file called practice-shopping.txt. Print the file’s contents with Get-Content.',
            expected: 'Buy apples\nBuy rice',
            hint: 'Change the two values in the array and use the same new path in both commands.',
            solution: `$lines = @("Buy apples", "Buy rice")
Set-Content -LiteralPath "./practice-shopping.txt" -Value $lines
Get-Content -LiteralPath "./practice-shopping.txt"`,
          },
          {
            title: 'Save an ordered list',
            review: 'Unit 2 · Arrays. Unit 3 · Pipelines.',
            task: 'Sort “wash”, “dry”, and “fold” alphabetically with a pipeline. Save the ordered result to practice-chores.txt and read it back. Rerun with the starting list in a different order and check that the file contents stay the same.',
            expected: 'dry\nfold\nwash',
            hint: 'Save the result of the pipeline in a variable. Pass that variable to Set-Content, then use the same path with Get-Content.',
            solution: `$chores = @("wash", "dry", "fold")
$sortedChores = $chores | Sort-Object
Set-Content -LiteralPath "./practice-chores.txt" -Value $sortedChores
Get-Content -LiteralPath "./practice-chores.txt"`,
          },
        ],
        question: 'Which command displays the saved lines?',
        choices: ['Set-Content', '-LiteralPath', 'Get-Content'],
        correct: 2,
        feedback: 'Look for the command that reads the file.',
        explanation: 'Set-Content writes the file. Get-Content reads it and emits the lines.',
      },
      {
        id: 'project',
        title: 'Project: score report',
        time: 18,
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
        practice: [
          {
            title: 'Save a pass or retry report',
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
          },
          {
            title: 'Save only the strongest results',
            review: 'Unit 1 · Strings. Unit 2 · Conditions and loops. Unit 3 · Pipelines and files.',
            task: 'Start with scores 8, 3, 5, and 6. Use your report loop to collect only passing scores (5 or higher). Sort that result and keep the two highest scores in descending order. Turn those two scores into the lines shown below, save them to practice-top-report.txt, and read the file back.',
            expected: 'Score 8 - pass\nScore 6 - pass',
            hint: 'In the first loop, output the number only when it passes. Sort and select while the values are still numbers. Use a second loop to format the selected scores as strings before saving.',
            solution: `$scores = @(8, 3, 5, 6)
$passing = foreach ($score in $scores) {
    if ($score -ge 5) {
        $score
    }
}
$topScores = $passing | Sort-Object -Descending | Select-Object -First 2
$lines = foreach ($score in $topScores) {
    "Score $score - pass"
}
Set-Content -LiteralPath "./practice-top-report.txt" -Value $lines
Get-Content -LiteralPath "./practice-top-report.txt"`,
          },
        ],
        question: 'Where should Set-Content go so it writes the whole report once?',
        choices: ['After the loop', 'Inside the if block', 'Before the loop'],
        correct: 0,
        feedback: 'Think about when $lines contains every score.',
        explanation: 'After the loop, $lines contains a report line for every score.',
      },
      {
        id: 'ticket-report',
        title: 'Challenge: ticket report',
        time: 20,
        intro: 'Use a function to calculate costs, a pipeline to rank them, and a text file to keep the report.',
        file: 'ticket-report.ps1',
        challenge: true,
        practice: [
          {
            title: 'Save the two largest order costs',
            review: 'Unit 3 · Functions, pipelines, and files. Unit 2 · Arrays, loops, and conditions. Unit 1 · Math and strings.',
            task: 'Write Get-OrderCost with a ticket-count parameter. Tickets cost 4 each, but orders of 5 or more pay 3 per ticket. Calculate costs for orders of 1, 6, 3, and 5 tickets. Keep the two highest costs in descending order and save the lines shown below to practice-ticket-report.txt. Read the file back. Then replace the order of 1 with an order of 8 and check that the report updates.',
            expected: 'Order cost: 18\nOrder cost: 15\n\nOrder cost: 24\nOrder cost: 18',
            expectedLabel: 'Original report, then report after changing 1 ticket to 8',
            hint: 'Test the function first with 3 tickets (12) and 5 tickets (15). Collect costs with foreach, sort the numbers before formatting them, then write the formatted lines once.',
            solution: `function Get-OrderCost {
    param($tickets)
    if ($tickets -ge 5) {
        $price = 3
    } else {
        $price = 4
    }
    $tickets * $price
}

$orders = @(1, 6, 3, 5)
$costs = foreach ($tickets in $orders) {
    Get-OrderCost -Tickets $tickets
}
$topCosts = $costs | Sort-Object -Descending | Select-Object -First 2
$lines = foreach ($cost in $topCosts) {
    "Order cost: $cost"
}
Set-Content -LiteralPath "./practice-ticket-report.txt" -Value $lines
Get-Content -LiteralPath "./practice-ticket-report.txt"`,
          },
        ],
      },
    ],
  },
];
