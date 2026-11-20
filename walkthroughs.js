const walkthroughs = {
  'first-script': {
    steps: [
      [1, 1, 'Write-Output is the command name. The space ends that name and starts its argument, the value you give the command. The double quotes tell PowerShell to treat the words, comma, and exclamation mark as one piece of text. The quotes are part of the script syntax. The text inside them is the value the command sends to the output.'],
    ],
    trace: 'A .ps1 file is plain text. Saving it keeps the command on disk. At the PowerShell prompt, ./hello.ps1 means run the file named hello.ps1 from the current folder. PowerShell reads the command, sends the greeting to its output, and returns to the prompt.',
    troubleshoot: 'If PowerShell cannot find hello.ps1, run Get-Location to check the folder and Get-ChildItem to check the filename. Look for hello.ps1.txt, which some editors create automatically. Use straight quotation marks in the file.',
  },
  variables: {
    steps: [
      [1, 1, '$city is the name you use to access a stored value. The dollar sign tells PowerShell to treat city as a variable name. The equals sign assigns the value on the right, the text Denver, to the variable on the left. Assignment by itself produces no output here.'],
      [2, 2, 'PowerShell looks up the current value of $city before calling Write-Output. The command receives Denver.'],
      [3, 3, 'This assignment uses the same variable name again, so Seattle replaces Denver. The output from line 2 has already been sent.'],
      [4, 4, 'The second call looks up $city again. This time the value is Seattle.'],
    ],
    trace: 'Read down the script in order. After line 1, the current value is Denver. After line 3, it is Seattle. The terminal shows both earlier output values in the order they were emitted.',
    troubleshoot: 'If both lines say Seattle, check which assignments run before each Write-Output. If the terminal shows the literal text $city, remove the single quotes around the variable in the output command.',
  },
  strings: {
    steps: [
      [1, 1, 'The assignment gives $name the string Avery. A string is text, including any spaces or punctuation you put between its delimiters.'],
      [2, 2, 'Within double quotes, PowerShell recognizes $name and substitutes its value before the command receives the argument. The exclamation mark remains ordinary punctuation.'],
      [3, 3, 'Within single quotes, $ and the letters after it are literal characters. PowerShell sends the entire greeting with $name still in it.'],
    ],
    trace: 'Both commands start with the same template. The first receives Hello, Avery! and the second receives Hello, $name! because their quote styles differ.',
    troubleshoot: 'If a variable runs into another word, put braces around just its name, as in "${name}book". That tells PowerShell where the variable name ends. Use single quotes when you want to display a dollar-prefixed name exactly as typed.',
  },
  numbers: {
    steps: [
      [1, 2, 'The two assignments give names to the inputs: 3 boxes and 4 items per box. Without quotation marks, 3 and 4 are numbers.'],
      [3, 3, 'PowerShell reads both values and uses * to multiply them. It stores the result, 12, in $total. Giving the result a name lets you print or reuse it later.'],
      [4, 4, 'The double-quoted message inserts 12 into the label. It is a string by the time Write-Output receives it.'],
    ],
    trace: 'The script computes 3 × 4 before it formats the output. Changing either input and rerunning recomputes $total automatically.',
    troubleshoot: 'If you get 34 from adding two values, check whether they were written as "3" and "4". Adding strings joins the text. Use numeric literals here, and keep the calculation on its own line before the message.',
  },
  input: {
    steps: [
      [1, 1, 'Read-Host displays the quoted prompt and pauses for a response. After you press Enter, it returns the text you typed. The assignment saves that returned value in $name. The prompt itself is displayed by Read-Host.'],
      [2, 2, 'At this point $name has a value. Double quotes expand it, and the second command sends the resulting greeting to the output.'],
    ],
    trace: 'Type Avery and press Enter. The prompt line shows the question and what you typed. The script emits Hello, Avery! on the next line. A fresh run asks again and gives $name the new answer.',
    troubleshoot: 'A waiting cursor after the question means the script is ready for input. Typing the digits 7 would produce a string containing 7. Convert it before doing arithmetic with it, as covered in Unit 4.',
  },
  conditions: {
    steps: [
      [1, 1, 'This assignment sets the score to the integer 7. Change this input to test a different path through the script.'],
      [2, 3, 'The parentheses hold the test, 7 -ge 5. The comparison means greater than or equal to and gives True or False. The opening brace starts the code that runs when the result is True.'],
      [4, 6, 'The first closing brace ends the True block. The else keyword introduces the False block. Its command runs only when the test is False, and the last brace ends that block.'],
    ],
    trace: 'A score of 7 reaches the first message. A score of 5 still reaches it because -ge includes equality. A score of 4 goes straight to the else message.',
    troubleshoot: 'Use -eq to test equality. A plain equals sign assigns a value. If the branch at the exact limit surprises you, test just below the limit, at the limit, and just above it.',
  },
  arrays: {
    steps: [
      [1, 1, '@(…) creates an array here. Commas separate the three elements, and quotation marks make each one a string. The array keeps them in the order they were written.'],
      [2, 2, 'The brackets next to the variable select one element. Counting begins at zero: apple is at index 0, pear at 1, and plum at 2. The command receives only apple.'],
      [3, 3, 'The dot reads a named property from the array. Count describes how many elements are present, so it returns 3. The final index is 2.'],
    ],
    trace: 'The first command reads one element. The next command reads information about the whole array. Neither operation changes its contents.',
    troubleshoot: 'For the second element, use index 1. If the element emits nothing, check the index against Count. With default settings, an index past the end of this array yields no value.',
  },
  loops: {
    steps: [
      [1, 1, 'The list $fruits contains three values. Its order is the order the loop visits.'],
      [2, 2, 'Read this as “for each value in $fruits, put the current value in $fruit”. The in keyword connects the item variable on the left to the list on the right.'],
      [3, 4, 'The braces enclose the body that runs once per element. Inside it, double quotes insert the current fruit. At the closing brace, PowerShell goes back for the next item if one remains.'],
    ],
    trace: 'On the first pass $fruit is apple. On the second it is pear, and on the third it is plum. Three items produce three lines.',
    troubleshoot: 'If every line lists all the fruits, check that the output uses the current item $fruit. If you add a heading or total meant to appear once, put it outside the braces.',
  },
  pipeline: {
    steps: [
      [1, 1, 'The array starts in the order 8, 2, 5. The values have numeric types, so this example will sort numerically.'],
      [2, 2, 'Each | connects one stage to the next. The first sends the array elements individually to Sort-Object, which produces 2, 5, 8. The next sends that ordered sequence to Select-Object. The -First parameter tells it to keep the first 1 item.'],
    ],
    trace: 'The output of each stage becomes the input to the next. Run the line without the final pipe and selection to see 2, 5, and 8 before picking the first value.',
    troubleshoot: 'If you pick a value before you sort, you can only sort the subset you already picked. To find the largest value, use Sort-Object -Descending before Select-Object -First 1.',
  },
  functions: {
    steps: [
      [1, 1, 'The function keyword registers a command called Get-Double. This line starts the definition. PowerShell runs the body only when the command is called.'],
      [2, 2, 'param declares the arguments the function accepts. $number is a variable inside the function. The caller can supply a value using the -Number parameter.'],
      [3, 4, 'The multiplication expression produces a number. Since it stands on its own, the result goes to the success output stream. The closing brace ends the definition.'],
      [6, 7, 'Each call supplies its own number. The first call binds 4 to $number and emits 8. The next binds 7 and emits 14.'],
    ],
    trace: 'PowerShell reads the definition once. It runs the body twice, once for each call, and emits one number each time.',
    troubleshoot: 'A statement that emits text inside the function becomes part of its output. If a caller needs a single number, keep unneeded messages out of that stream. Unit 8 shows how to send diagnostics separately.',
  },
  files: {
    steps: [
      [1, 1, 'The two strings form an array, with one intended line of file content per element. At this point they exist only in the running script.'],
      [2, 2, 'Set-Content writes data to a file. -LiteralPath takes the exact path, without treating wildcard characters as patterns. ./ means the current folder. -Value receives the array, and this cmdlet writes each element as a separate line.'],
      [3, 3, 'Get-Content opens that same path and emits the text one line at a time. You see the result of reading the file back, rather than the act of writing it.'],
    ],
    trace: 'The array becomes two lines on disk, then Get-Content produces those same two lines in the output. The file remains after the script finishes.',
    troubleshoot: 'Use a new practice filename. Set-Content replaces existing content at that path. If you cannot find the file, check Get-Location. Unit 6 shows how to target the script’s own folder even when you run it from somewhere else.',
  },
  project: {
    steps: [
      [1, 1, 'The input is an array of three numbers. Start by keeping the raw data separate from how you will display it.'],
      [2, 2, 'The assignment collects whatever the foreach loop outputs into $lines. Within the loop, $score holds one input number at a time.'],
      [3, 4, 'Each pass evaluates one string and makes it available to the assignment. The closing brace ends the repeated work. None of those strings need to be printed to the terminal while the loop is running.'],
      [5, 5, 'Write-Output emits the collected strings one by one. This lets you inspect the whole report before adding a command that saves it.'],
    ],
    trace: 'The loop produces Score 8, Score 3, and Score 5 in input order. $lines contains those strings, and the final command displays them.',
    troubleshoot: 'When you add if/else, assign a label in both branches so each item gets a fresh value. Put file-writing after the loop so Set-Content writes the complete report once.',
  },

  types: {
    steps: [
      [1, 1, 'The quotes create a String. The -as operator attempts to convert it to the type in brackets. [int] is PowerShell’s short name for System.Int32, a 32-bit signed whole number. If the value cannot be converted, this expression yields $null.'],
      [2, 2, '.GetType() calls a method on the value. Its result is a type object, and .Name reads that object’s short name, Int32.'],
      [3, 3, 'The parentheses evaluate the addition before Write-Output is called. Both operands are numbers, so + performs arithmetic and the command receives 9.'],
    ],
    trace: 'The left operand often determines how PowerShell interprets +. Compare ("7" + 2), which yields the text 72, with (([int]"7") + 2), which yields the number 9.',
    troubleshoot: 'Test $null -eq $amount before calling .GetType() on a possibly failed conversion. A simple if ($amount) also treats zero as false, which would reject a valid count of 0. An explicit cast such as [int]"tea" raises an error instead of returning $null. Conversion is not the same as input validation. For example, "1.5" converts to 2 and empty text can convert to 0. Check the string format first if you need whole-number input.',
  },
  hashtables: {
    steps: [
      [1, 1, '@{…} creates a hashtable. Each entry pairs a key with a value using =. The semicolon separates entries on this line. Tea and Coffee are keys. Unlike an array index, a key describes what the value means.'],
      [2, 2, 'The bracket expression looks up the value at the Tea key, which is 3. A new hashtable stores that value under the command parameter name InputObject.'],
      [3, 3, 'Using @options in the command call expands the hashtable into named arguments. This has the same effect as Write-Output -InputObject 3. The key names omit the leading dash inside the table.'],
    ],
    trace: 'There are two lookups with different jobs: the first table represents prices and the second represents command arguments. Changing Tea to 5 changes the supplied InputObject to 5 without changing the call.',
    troubleshoot: 'Use $options to refer to the table as one object and @options to splat it in a call. When you look up a catalog item, use ContainsKey before deciding that a $null result means the key is absent.',
  },
  patterns: {
    steps: [
      [1, 1, '-match interprets the right operand as a regular expression. ^ starts the match at the beginning, [A-Z]{2} consumes two letters, the dash is literal, [0-9]{2} consumes two digits, and $ marks the end. This scalar comparison produces True for AB-04.'],
      [2, 3, 'switch tries the value draft against each case. The draft case matches and emits its block’s message. Each case has its own braces.'],
      [4, 6, 'The ready case has a different label. The default block runs only if no case matches. The last brace closes the switch. In switch -Regex, patterns can overlap and multiple blocks can run. Use break when you want to stop after a match.'],
    ],
    trace: 'The regex check and the switch are independent. Changing AB-04 to AB-4 makes the first result False. The draft message still appears because that switch has a separate input.',
    troubleshoot: 'With -like, *.txt is a wildcard pattern. With -match, use a regex such as "\\.txt$" to look for a literal dot followed by txt at the end. Comparisons such as -match are case-insensitive by default. Use -cmatch to require the case shown by the pattern.',
  },
  dotnet: {
    steps: [
      [1, 1, 'The outer brackets identify a .NET type. List[string] says which type of element it holds. :: invokes a member on the type itself, and new() creates an empty list instance.'],
      [2, 3, 'A dot calls a member on an instance. Trim() removes leading and trailing whitespace from the first string. Add() appends each supplied value to the same list and this List method returns no output.'],
      [4, 5, 'Count reads the list’s length. The bracket index reads the first entry without removing it. A typed list supports zero-based indexing just like the array in Unit 2.'],
    ],
    trace: 'The list starts empty, grows to one element containing Mira, then grows to two after Ari. The Count and index reads leave the collection unchanged.',
    troubleshoot: 'Use parentheses to call a method, even one with no arguments. For example, "  Mira  ".Trim() computes text. Leaving off the parentheses refers to the method itself. Use :: for a static member such as [Math]::Round, and a dot for an instance member such as $names.Add.',
  },
  objects: {
    steps: [
      [1, 1, '[pscustomobject] converts the named fields into an object with two properties. Name is a string. Minutes is a number. The labels let later commands access each fact independently.'],
      [2, 2, 'Get-Member inspects the object. -Name Minutes limits the result to the definition of that one member. Select-Object -ExpandProperty MemberType emits the definition’s member type, NoteProperty, as a value.'],
      [3, 3, 'The dot accesses the original object’s Name property. It gives Pack without formatting or searching the whole object.'],
    ],
    trace: 'There are two levels here. The object’s Minutes property has the value 10. The metadata about that property says it is a NoteProperty. To inspect the type of the value 10, use $task.Minutes.GetType().Name.',
    troubleshoot: 'If Get-Member shows unexpected fields, inspect the object immediately before you access it. After a selection or conversion, a different object may be on the pipeline.',
  },
  'filter-project': {
    steps: [
      [1, 4, '@(…) collects two objects on separate lines. Each has the same property names, so the rest of the pipeline can ask the same question of both records.'],
      [5, 5, 'Where-Object runs the braces as a script block for each input object. $_ is that object, .Minutes reads its number, and -ge compares it to 15. Only qualifying objects continue. Select-Object -ExpandProperty Name takes the surviving object’s Name value out of the object.'],
    ],
    trace: 'Pack reaches the filter with 10 and stops there. Ship reaches it with 25 and continues as a whole object. The last stage reads the name only after the filter has finished using Minutes.',
    troubleshoot: 'Inspect the output after Where-Object if you get the wrong names. With Select-Object Name, the output is an object with a Name property. With -ExpandProperty Name, the output is the property value itself.',
  },
  'group-measure': {
    steps: [
      [1, 4, 'Each book record has a Category and a numeric Cost. Keeping Cost numeric lets a later command add the values without parsing text.'],
      [5, 5, 'Measure-Object receives both records. -Property Cost chooses which values to measure and -Sum asks it to total those values. The command returns a statistics object, which is stored in $total.'],
      [6, 6, 'Reading .Sum gets a single property from the statistics object. Write-Output emits the number 12.'],
    ],
    trace: 'Measuring the collection once gives one total. For one total per category, run Group-Object -Property Category first. Each resulting group has Name, Count, and Group. Measure the original records in its Group property to get that category’s sum.',
    troubleshoot: 'If you see formatting records or missing properties in later stages, move Format-Table to the last stage. For example, run $items | Format-Table -Property Category, Cost only for display. Select and calculate from the original objects first.',
  },
  paths: {
    steps: [
      [1, 1, '$PSScriptRoot is the directory that contains this saved script. Join-Path combines that directory with a filename using the provider’s path separator. The assignment stores the complete path, without creating a file.'],
      [2, 2, '-LiteralPath gives Set-Content the exact file name. -Value gives it the text to write. This step creates the file or replaces existing content.'],
      [3, 3, 'Test-Path checks the same location. -PathType Leaf requires a leaf item, which is a file in this filesystem example. Its Boolean result becomes the argument to Write-Output.'],
    ],
    trace: 'Running the saved script from a different directory still writes beside the script, because $PSScriptRoot stays tied to the script file. The current location controls a relative path such as ./path-example.txt.',
    troubleshoot: 'Run the file as a script when using $PSScriptRoot. If you paste a line directly into an interactive prompt, that variable may not identify a script directory. Use Get-Location to check your working directory and inspect $path before writing.',
  },
  csv: {
    steps: [
      [1, 1, 'Build the output path beside the script so import and export use the same file. CSV stands for comma-separated values, a text format for rows and columns.'],
      [2, 3, 'The object’s Name and Score become column headers. Its property values become one row. Export-Csv writes them with CSV quoting rules. -NoTypeInformation omits the optional type metadata line.'],
      [4, 4, 'Import-Csv reads the header to name the properties on the imported row. CSV does not preserve PowerShell data types here, so the Score property now holds the text 9.'],
      [5, 5, 'Each $(…) evaluates an expression inside the string. The first reads Name. The second uses [int] to convert Score before adding 1. The string becomes Rin: 10.'],
    ],
    trace: 'Compare the object before export with the imported row. Both have a Score property, but the imported score must be converted before numeric arithmetic or sorting.',
    troubleshoot: 'If imported rows have unexpected columns, open the CSV as plain text and inspect its header and delimiter. Use the same -Delimiter on export and import if the source file uses a separator other than a comma.',
  },
  json: {
    steps: [
      [1, 1, 'The outer single quotes tell PowerShell to pass the JSON as literal text. Inside JSON, braces enclose objects, the colon separates a key from its value, commas separate entries, and brackets enclose an array. JSON keys and string values use double quotes.'],
      [2, 2, 'ConvertFrom-Json parses the text and creates PowerShell data. At this point $data has a course property whose value is another object.'],
      [3, 4, 'Follow the properties from left to right. .course.name reads the text name. .course.units gets the list of unit numbers, and .Count reads its length.'],
    ],
    trace: 'The full path to the name is data → course → name. The full path to the count is data → course → units → Count. Use .units[0] to get the first unit instead of its count.',
    troubleshoot: 'Check for missing double quotes or mismatched braces if parsing fails. When reading a file, use Get-Content -Raw to pass the document as one string. When writing nested data, set ConvertTo-Json -Depth for the levels you need to keep.',
  },
  'advanced-functions': {
    steps: [
      [1, 2, 'Define Get-Square as an advanced function. [CmdletBinding()] makes common parameters such as -Verbose available and enables cmdlet-style parameter behavior. The empty parentheses indicate that this attribute uses its default settings.'],
      [3, 4, 'The param block defines the input. [Parameter(Mandatory, ValueFromPipeline)] makes it required and allows the current pipeline object to bind to it. A caller can also supply it by name.'],
      [5, 7, 'The type constraint converts or checks the supplied value as an integer. ValidateRange accepts only numbers from 0 through 100, including both bounds. A rejected input raises a parameter binding error before the function body processes it.'],
      [8, 9, 'The process block runs once for each successfully bound pipeline item. Its expression emits the square. The final brace closes the whole function definition.'],
      [10, 10, 'The array sends 2 and 5 as separate objects. PowerShell binds them one at a time to $Number.'],
    ],
    trace: 'The first process pass receives 2 and emits 4. The second receives 5 and emits 25. For a total across items, initialize it in begin, update it in process, and emit it once in end.',
    troubleshoot: 'When a value can be passed by name but fails through the pipe, verify that ValueFromPipeline is enabled and that the incoming object can bind to the declared type.',
  },
  scope: {
    steps: [
      [1, 1, 'The script creates $label in its current scope. A scope determines which names are visible and where assignments take effect.'],
      [2, 5, 'The function body makes a local $label when it assigns inner. Reading $label on the next line finds that local value first. Leaving the function ends that local scope.'],
      [6, 7, 'The call emits inner. The last line runs in the script’s scope again, so $label there still has the value outer.'],
    ],
    trace: 'A function can often read a name from its parent scope when it has no local value. An explicit parameter makes that dependency visible. In the exercise, & runs the child script in its own scope. Dot-sourcing with . runs it in the caller’s scope and can add or overwrite names there.',
    troubleshoot: 'If a function works from your terminal but fails in a fresh session, look for variables it reads without declaring them. Add a parameter and pass the value at the call site.',
  },
  modules: {
    steps: [
      [1, 2, 'The first line chooses a .psm1 filename for a script module. The next line starts a single-quoted here-string. A here-string spans lines. Single quotes keep $Name and the other script text literal while the module file is being written.'],
      [3, 6, 'These lines are the source of the exported command. It accepts Name as a string and emits a greeting when it is later called. During the file-writing step, these lines are still just text.'],
      [7, 8, 'The module source names Get-Greeting as a public function. The closing marker ends the here-string and the pipe sends its full text to Set-Content. Keep the closing marker at the beginning of its line.'],
      [9, 10, 'Import-Module loads the file into this session. -Force reloads it when you rerun the example after editing. The caller invokes the exported command with the named argument Ana.'],
    ],
    trace: 'Writing the module creates the file. Importing it runs its module-level code and makes the exports available. Calling Get-Greeting runs only the function body. A .psd1 manifest can declare the entry module, public commands, and version alongside the source.',
    troubleshoot: 'If Get-Greeting is unavailable, verify the .psm1 path and inspect (Get-Module GreetingLab).ExportedCommands. If the saved module substituted $Name prematurely, check that both here-string markers use single quotes.',
  },
  classes: {
    steps: [
      [1, 1, 'The enum declares two named values for TaskState. The semicolon separates the members within this single line. Later code refers to a value with a type and ::, such as [TaskState]::Draft.'],
      [2, 4, 'The class defines a new type called TaskCard. Name has string type. State has TaskState type, so a property assignment must provide a value that PowerShell can convert to that enum.'],
      [5, 8, 'The constructor has the same name as the class. It receives a string argument and runs when a new task is created. $this is the instance under construction. The constructor sets Name to the argument and State to Draft.'],
      [9, 12, 'Describe() is a method that returns a string. Each $(…) evaluates a property expression while building that string. return supplies the method result, and the two closing braces end the method and class.'],
      [13, 14, '::new("Pack") creates and initializes one task. The dot invokes Describe on that particular object.'],
    ],
    trace: 'The task carries its own Name and State. Creating a second instance creates a second set of properties. Changing the second task to Ready leaves the first task’s State as Draft.',
    troubleshoot: 'Use an enum member such as [TaskState]::Ready when setting State. If a method produces no usable result, check the declared return type and the explicit return expression.',
  },
  errors: {
    steps: [
      [1, 3, 'The try block begins with a conversion that cannot succeed. The cast raises an error and execution leaves this block before reaching the next string.'],
      [4, 5, 'catch handles the terminating error. Inside it, $_ refers to the error record. This example emits a brief message, but you can inspect $_.Exception.Message during development to understand the cause.'],
      [6, 8, 'finally runs after try and any catch. Put cleanup here when it must occur even if earlier work failed. The example emits a marker so you can see that it ran.'],
    ],
    trace: 'With unknown, the path is try → catch → finally. Change the text to "7" and the path becomes try → finally. That is a quick way to verify both paths.',
    troubleshoot: 'Some cmdlets report nonterminating errors and continue. If a failing cmdlet never enters catch, use -ErrorAction Stop on that command when the failure should stop the operation.',
  },
  diagnostics: {
    steps: [
      [1, 3, 'Get-LabTotal is an advanced function. CmdletBinding enables common parameters, including -Verbose. [int] declares how Count should be interpreted.'],
      [4, 6, 'Write-Verbose sends a diagnostic to stream 4 when verbose output is enabled. The multiplication expression sends a number to stream 1, the success stream. The caller can use the two streams for different purposes.'],
      [7, 8, 'The named argument binds 4 to Count. The assignment stores the success output, 12. The last line formats the captured number for display.'],
    ],
    trace: 'Add -Verbose to the call to make the diagnostic visible. $result still contains 12. Add 4>&1 to merge verbose into success output deliberately and the capture then includes both a verbose record and the result.',
    troubleshoot: 'If a numeric function returns an array containing text, check for diagnostic strings written to the success stream. Move them to Write-Verbose or an appropriate diagnostic stream.',
  },
  testing: {
    steps: [
      [1, 4, 'The function defines a boundary rule. It takes a whole number, compares it to 20, and emits exactly one status string. The expected results can be stated without knowing how the function is implemented.'],
      [5, 5, 'Arrange and act by choosing the boundary input, 20, calling the function, and storing the actual result.'],
      [6, 6, '-ne checks whether the actual result differs from the expected result. On a mismatch, throw creates a terminating error before the script can report success.'],
      [7, 7, 'This message is reached only if the assertion condition was false, meaning the actual status matched Met.'],
    ],
    trace: 'At 20 the contract says Met. A test at 19 should separately expect Short. Together those cases catch an accidental switch from -ge to -gt.',
    troubleshoot: 'Change the implementation temporarily so the test should fail. If it still passes, inspect what the assertion compares and make sure it checks the actual output.',
  },
  pester: {
    steps: [
      [1, 2, 'Import Pester using a module specification. ModuleVersion sets a minimum of 5.0.0 for this import. The next line picks a .Tests.ps1 filename beside the script.'],
      [3, 4, 'The single-quoted here-string holds the test source. Describe gives Pester a named group for related behaviors. The braces form the group’s script block.'],
      [5, 8, 'It names one test. Parentheses evaluate 2 + 3 before the result passes to Should -Be 5. Should fails the test if the actual value differs. The closing braces end It and then Describe.'],
      [9, 10, 'Write the test file. Invoke-Pester discovers and runs the tests at that path. -Output None suppresses its usual rendering, and -PassThru returns a summary object.'],
      [11, 11, 'Read PassedCount from the summary and insert it into a string. There is one passing test in this example.'],
    ],
    trace: 'The setup script produces the test file. Pester then reads its Describe and It definitions and runs each assertion. Change the expectation from 5 to 6 and inspect FailedCount to verify you can detect a failure.',
    troubleshoot: 'If Describe or Invoke-Pester is unavailable or -Output None is rejected, inspect Get-Module Pester and its Version. In automated execution, use -CI when a failing suite must set a nonzero process exit code.',
  },

  discovery: {
    steps: [
      [1, 1, 'Get-Command looks up the name Get-ChildItem. -CommandType Cmdlet restricts the lookup to cmdlets, so an alias or function of the same name is excluded. The assignment keeps the command-information object for inspection.'],
      [2, 2, 'Source identifies where the command comes from. Microsoft.PowerShell.Management is the module that provides this cmdlet.'],
      [3, 3, 'Parameters is a dictionary of parameter names and their definitions. ContainsKey asks whether LiteralPath is in that dictionary and returns a Boolean. Type the key without the dash used when invoking the command.'],
    ],
    trace: 'Start with Get-Command when you need to find a command or confirm what is installed. Use Get-Help Get-ChildItem -Examples to learn how to call it. If local help is sparse, Get-Help Get-ChildItem -Online opens the command’s online reference.',
    troubleshoot: 'If a shortcut works in your terminal but fails for someone else, inspect it with Get-Alias and use the command’s full name in the script. Try the script in pwsh -NoProfile to expose dependencies on your startup profile.',
  },
  'native-programs': {
    steps: [
      [1, 1, '$PID is the ID of the current PowerShell process. Get-Process returns that process object. The parentheses finish the lookup before .Path reads the executable’s location.'],
      [2, 2, 'The array gives the child three arguments. -NoProfile skips startup profiles. -Command tells the child to execute the next argument as PowerShell code. The string exit 3 stays one array element despite the space inside it.'],
      [3, 3, '& invokes the executable at the path stored in $shellPath. @arguments splats the array as separate arguments. This launches a child process. The parent continues after it returns.'],
      [4, 5, '$LASTEXITCODE holds the child’s reported status. Copy it immediately so another native call cannot overwrite it. The last line prints the value saved from this call.'],
    ],
    trace: 'Here the child deliberately exits with 3 and writes no normal output. The parent is still running and can interpret that status. The meaning of nonzero exit codes depends on the program you called.',
    troubleshoot: 'If the path prints as text, check for the & call operator. If a program receives split words, check the argument array. Use one element per intended argument, including a single element for each value containing spaces.',
  },
  'web-apis': {
    steps: [
      [1, 1, 'Invoke-RestMethod makes an HTTP GET request here. -Uri gives it the endpoint address and -TimeoutSec sets a 15-second timeout. When the API returns JSON with the appropriate content type, the cmdlet converts it into objects. The assignment saves the response object.'],
      [2, 2, 'The dot reads full_name, a field in the response. The underscore is part of the API’s field name. It is different from name, which omits the owner.'],
    ],
    trace: 'Follow the data from URL → HTTP response → parsed object → full_name. Use Get-Member on $repository to inspect the actual fields. Some APIs return pages, so check the documentation before assuming that one request returns all records.',
    troubleshoot: 'If the request times out or the server returns an error, check the endpoint, status, and rate limits before reading any fields. Use try/catch with -ErrorAction Stop for a deliberate fallback, and avoid logging tokens or request headers that contain secrets.',
  },
  jobs: {
    steps: [
      [1, 1, 'Start-Job runs the supplied script block in a separate PowerShell process. -ArgumentList supplies 6 to the block’s param($number). The multiplication inside the block emits 12. The parent assignment stores the job object, which is a handle to the running work.'],
      [2, 3, 'Receive-Job asks for the output from this job. -Wait waits for the job to finish so the output is available before cleanup. The result from the worker is written to the parent’s output by Receive-Job.'],
      [4, 6, 'The finally block runs during cleanup. Remove-Job removes this job from the session’s job list. -Force also allows removal if it is still running. Only the job referenced by $job is targeted.'],
    ],
    trace: 'There are two separate things to inspect: $job.State tells you about the work, and Receive-Job gives you its output. By default, receiving output consumes it. Use -Keep if you need to receive it again before removing the job.',
    troubleshoot: 'If a worker cannot see a local variable, pass it explicitly with -ArgumentList and bind it in the block’s param list. If a result is missing, look at the job’s state and error output before removing it.',
  },
  parallel: {
    steps: [
      [1, 1, '$factor belongs to the calling script and is defined before the parallel work starts.'],
      [2, 3, 'The pipeline gives 4 and 2 to ForEach-Object. -Parallel runs the block for each item in a worker runspace, which has its own execution context. $_ is the current item and $using:factor accesses the factor from the caller.'],
      [4, 4, '-ThrottleLimit 2 caps concurrent work at two. Worker output can arrive in either order. Sort-Object sorts the numbers once they reach the next stage.'],
    ],
    trace: 'One worker computes 12 and the other computes 6. Sorting gives reproducible output regardless of which finishes first. If original input order matters, carry an index in each result object and sort by that index.',
    troubleshoot: 'This parameter requires PowerShell 7. If a variable is empty inside the block, check whether it belongs to the worker or needs $using:. Pass shared values as input and return separate result objects instead of mutating shared data.',
  },
  'script-blocks-remoting': {
    steps: [
      [1, 2, 'The braces create a script block and assign it to $report without running it. param declares a string called Label that the block expects when it is invoked.'],
      [3, 4, 'When invoked, the block builds one object with Label from its argument and a fixed Engine value. The closing brace ends the deferred code.'],
      [5, 5, 'Invoke-Command executes the block. With no remote target, it executes locally. -ArgumentList "lab" supplies the first parameter by position, and the assignment stores the returned object.'],
      [6, 6, 'The subexpressions access the result’s two properties. Formatting happens in the caller, after the block emits structured data.'],
    ],
    trace: 'Test the block locally first. With an already configured session on a host you administer, -Session changes the execution location. Perform necessary method calls inside the block because returned remote objects usually contain serialized property data.',
    troubleshoot: 'If the block works locally but fails in a configured session, check for variables, paths, or commands that exist only on your computer. Pass required inputs explicitly and use paths that exist where the block actually runs.',
  },
  processes: {
    steps: [
      [1, 1, '$PID is the ID of the PowerShell process running this script. Get-Process -Id looks up that exact process and returns an object. Its properties describe the process without relying on the terminal table.'],
      [2, 2, 'The $(…) subexpression reads the returned .Id property and compares it with $PID using -eq. Double quotes insert the Boolean comparison result into the message.'],
    ],
    trace: 'The number varies across sessions, but the equality is stable. A name lookup can match several processes. The ID identifies one running process at the time of the query.',
    troubleshoot: 'When looking up an ID other than $PID, account for the process ending before the lookup. Use appropriate error handling and keep read-only inspection separate from any command that changes process state.',
  },
  'services-cim': {
    steps: [
      [1, 1, '$IsWindows is a built-in platform flag in PowerShell 7. The if block prevents the Windows-specific query from running on a different platform.'],
      [2, 2, 'Get-CimInstance reads a Windows management object. -ClassName chooses the operating-system class and -Property asks for Caption. -ErrorAction Stop makes errors from this command enter a surrounding catch if you add one.'],
      [3, 3, 'The static string method checks whether Caption is missing or empty. -not reverses the result, so True means a caption is available. The script reports the check rather than depending on any specific Windows edition name.'],
      [4, 6, 'The else branch runs when the platform test is false. It explains why the query was skipped. The final brace ends the branch.'],
    ],
    trace: 'Get-CimInstance reads management classes. Get-Service returns service objects with properties such as Name and Status. Pick the command based on the object you need, then inspect those properties before shaping a report.',
    troubleshoot: 'If the query fails on Windows, separate platform support, access permissions, and the requested class. Try reading the named class directly and inspect the error before changing the report logic.',
  },
  logs: {
    steps: [
      [1, 4, 'Build two repeatable event records. Id identifies the event kind and Level describes its severity. In this Windows-style sample, 2 represents Error and 4 represents Information.'],
      [5, 5, 'Where-Object sees each event as $_ and keeps it only when its Level equals 2. The final stage expands Id, so only 40 leaves the pipeline.'],
    ],
    trace: 'The sample lets you check filtering without reading a real log. In a live Windows query, use Get-WinEvent -FilterHashtable with LogName, Level, and StartTime so the log system can filter before returning records.',
    troubleshoot: 'If the count is too high, verify that the severity and time conditions operate on the same event. Inspect the time type and compare date values rather than display strings. Wrap the filtered output in @() when you need a reliable count for zero, one, or many matches.',
  },
  whatif: {
    steps: [
      [1, 3, 'Define a function with a string Path parameter. SupportsShouldProcess on CmdletBinding adds -WhatIf and -Confirm. The function still has to ask for permission immediately before any side effect.'],
      [4, 4, '$PSCmdlet refers to the active advanced-function invocation. ShouldProcess takes the target and the action description. It returns a Boolean that decides whether the body should run.'],
      [5, 7, 'Set-Content is the modification and sits inside the conditional block. Closing the braces ends the conditional and the function definition.'],
      [8, 9, 'Join-Path selects the example target. Calling with -WhatIf makes ShouldProcess describe the action and return False, so this invocation skips Set-Content.'],
    ],
    trace: 'Preview tests whether a change would be attempted without doing it. A change check answers a different question: does the target already have the desired content? Combine both so a real rerun can skip unnecessary writes.',
    troubleshoot: 'Test with a fresh practice path and verify its existence before and after preview. If a file appears during -WhatIf, look for writes or folder creation outside the ShouldProcess block.',
  },
  secrets: {
    steps: [
      [1, 1, 'The env: prefix addresses the Environment provider. This assignment places a fake value in the current process environment. It may be visible to child processes, so the example uses practice data only.'],
      [2, 4, 'The static IsNullOrWhiteSpace method checks for an unset, empty, or whitespace-only value. -not makes $available True when a usable value is configured. The output includes the flag and leaves out the value.'],
      [5, 7, 'The finally block removes the practice variable after the check. -ErrorAction SilentlyContinue suppresses a nonterminating removal error, such as the entry already being absent. The cleanup also runs if the check fails.'],
    ],
    trace: 'The configuration check only verifies that a value exists. It does not verify that a real credential is valid or authorized. For a scheduled job, arrange access through an approved secret store and grant it to the account that actually runs the job.',
    troubleshoot: 'If the check succeeds interactively but fails on a schedule, check the job’s identity and how it receives settings. Avoid printing the whole environment when diagnosing a missing setting.',
  },
  'scheduled-scripts': {
    steps: [
      [1, 1, 'The script-level param block declares a string Mode and a default value. A caller can supply -Mode explicitly. The default allows the script to run without waiting for input.'],
      [3, 4, '-ne compares Mode against the supported value. On a mismatch, [Console]::Error.WriteLine sends the message to the process’s standard error stream. This is separate from ordinary report output.'],
      [5, 6, 'exit 2 ends the run with a nonzero status for invalid input. The closing brace ends the error branch.'],
      [7, 8, 'The success path emits its normal message and exits with code 0. These lines are reached only if the mode check did not reject the input.'],
    ],
    trace: 'Use pwsh -NoProfile -NonInteractive -File with the full script path. Run once with the default and once with -Mode unknown. In a parent PowerShell process, read $LASTEXITCODE after each invocation. A scheduler can distinguish success from failure without searching the message text.',
    troubleshoot: 'If the exact command works in a terminal but fails unattended, check the job’s working directory, account, filesystem permissions, and environment. Use $PSScriptRoot for files bundled with the script.',
  },
};

const challengeCheckpoints = {
  'snack-order': [
    ['Set up the three inputs', 'Give the snack name, pack quantity, and unit price separate variables. Use quotes for the name and numbers without quotes for the quantity and price.', 'Print the stored values temporarily. You should see Granola, 3, and 4.'],
    ['Calculate the subtotal', 'Multiply the pack quantity by the price per pack and save the result. Keep this expression separate from the sentence that displays it.', 'The total should be 12. Check this before adding the receipt labels.'],
    ['Generate the two receipt lines', 'Use double quotes to insert the name and pack count into the first line and the stored total into the second.', 'Change only the pack quantity to 5. The receipt should show 5 packs and a total of 20.'],
  ],
  'study-goal': [
    ['Turn the answer into a number', 'Save the result of Read-Host, then use if/else to turn short into 15 and long into 25. Work with the numeric target for the rest of the script.', 'Check that short sets 15 and long sets 25 before adding the loop.'],
    ['Classify sessions one at a time', 'Loop over 10, 15, and 25. Compare each item with the target and print one label for that item. Include equality in the comparison.', 'For short, the first session falls short and the next two meet the goal. For long, only the 25-minute session meets it.'],
    ['Keep one running count', 'Set the count to zero before the loop and increment it inside the branch for a session that meets the goal. Print the count after the loop.', 'Two separate runs should count 2 sessions for short and 1 for long. If every run shows 1, check whether you reset the count inside the loop.'],
  ],
  'ticket-report': [
    ['Test the price rule in isolation', 'In the function, choose the price per ticket from the ticket count, then return the count multiplied by that price. Leave formatting to the caller.', 'A standalone call for 4 tickets should give 16. A call for 5 should give 15 because the discounted price starts at 5.'],
    ['Collect and rank numeric costs', 'Call the function once per order and save the resulting numbers. Sort those numbers in descending order before taking the first two.', 'The costs in input order are 4, 18, 12, and 15. The top two are 18 and 15.'],
    ['Write the final report', 'Convert the two costs to labeled lines after sorting, then write and read back the practice report using one path.', 'Changing the first order to 8 tickets should put 24 and 18 in the file. The file should still have only two lines.'],
  ],
  'inventory-challenge': [
    ['Check the format and the catalog', 'Use an anchored regex to validate the code shape. Use ContainsKey separately to test whether the well-formed code is in the hashtable. Both conditions must be true.', 'TEA-01 passes both checks. BAD fails the format check. ABC-12 has the right format but is absent from the catalog.'],
    ['Convert the quantity before comparing', 'Use ^[0-9]+$ before converting the text to an integer. The + requires one or more digits. The anchors require the entire input line to match. Conversion alone can round a fraction. Require the converted quantity to be greater than zero before looking up a price.', 'A quantity of 4 qualifies. Try 0, 1.5, and the word tea. Each should take the invalid path without a multiplication.'],
    ['Calculate only for a valid order', 'Look up the price inside the valid branch and multiply it by the converted quantity. Give the other branch a clear message.', 'TEA-01 and 4 should produce 12. A bad code and valid quantity should still be rejected.'],
  ],
  'timesheet-challenge': [
    ['Filter the entries first', 'Make objects with Team and Minutes properties. Filter out entries with zero or negative minutes before grouping, so invalid rows do not affect counts.', 'Three rows survive the original filter. The Ops row with 0 minutes is excluded.'],
    ['Build one summary object per group', 'For each group, measure the Minutes property of the original rows in .Group. Store the group name, sum, and count in a new object.', 'Before sorting, Web should have 30 minutes and 2 valid entries. Ops should have 5 minutes and 1 entry.'],
    ['Sort the numeric summaries', 'Sort by Total descending while it is still numeric, then format each summary for display.', 'Change the 20-minute Web row to 0. Web should now have 10 minutes and 1 entry. If its count stays at 2, check where filtering occurs.'],
  ],
  'data-conversion-challenge': [
    ['Read and type the source rows', 'Make the CSV and read it back. Convert the Quantity property to an integer as you construct clean objects, because Import-Csv reads it as text.', 'Inspect the type before and after conversion. It should go from String to Int32.'],
    ['Filter and sort the typed rows', 'Keep quantities at or below the threshold. Sort on the numeric property and wrap the result in @() so the variable holds an array for any result count.', 'Threshold 2 should keep Adapter and Cable in that order. Threshold 1 should retain just Adapter.'],
    ['Verify both the JSON and the output', 'Pass the array as one value to ConvertTo-Json -InputObject. Read the finished file as one string and parse it again.', 'Even with one remaining row, the saved JSON should begin with an array bracket. The reloaded quantity should still be a numeric value.'],
  ],
  'module-challenge': [
    ['Get one function call right', 'Write the function body to choose a status from one integer. Make the body emit a custom object with the original score and its status.', 'With one named call at 59, inspect the result. Its Score should be 59 and its State should be Retry.'],
    ['Define the input contract', 'Use a mandatory parameter that accepts pipeline input and validates the inclusive 0–100 range. Emit the object from process so the rule runs for each score.', 'Pipe 59 and 60 together. They should yield two objects. Run 101 separately and verify it triggers validation.'],
    ['Package it and test it from the caller', 'Save the function in a .psm1 file, export Get-ScoreResult, and import the module. Keep the text formatting in the script that calls it.', 'In a fresh PowerShell session, import the file and confirm Get-ScoreResult is available and still returns objects with Score and State.'],
  ],
  'reliability-challenge': [
    ['Define the parser’s contract', 'Check for digits only first, then convert with -as [int]. Conversion can round fractions, so the format check matters. A value outside the integer range gives $null. Compare with $null explicitly so zero is accepted.', 'Call the parser with "0", "3", "-1", "tea", and "1.5". The first two should emit integers. The rest should throw.'],
    ['Assert the accepted cases', 'Call the function with each accepted input and compare the actual output with its expected number. Throw a different message identifying the input if there is a mismatch.', 'Temporarily change the expected result for "3" and confirm that the assertion fails. Restore the correct expectation before proceeding.'],
    ['Assert the real error outside catch', 'Start with an empty error variable. Call the parser in try and save the exception message in catch. Then assert on that variable outside catch so the test does not catch its own failure.', 'If the parser accepts "tea" or "1.5", or throws a different message, the test must fail. Report success only after all four checks.'],
  ],
  'api-challenge': [
    ['Make the default path deterministic', 'Put the script-level Live switch at the top. Parse the supplied example JSON and store the object before attempting any request.', 'Run with no arguments and no network. It should reliably print Example/Docs and the archived flag False.'],
    ['Use one optional request', 'Inside the Live branch, use try/catch to replace the object only if the HTTP request succeeds. Use the same fields in the live and sample objects.', 'With internet access, -Live should report PowerShell/PowerShell. Verify that you still use just one formatting statement for either source.'],
    ['Test the error path separately', 'Temporarily replace the endpoint in your practice copy with an invalid one and run with -Live. Send the fallback message to the warning stream and keep the sample as the source of the report.', 'The warning should be visible, with the offline sample still available as normal output. Restore the original endpoint afterward.'],
  ],
  'parallel-challenge': [
    ['Make inputs and test the worker logic', 'Use Join-Path to create two file locations. Give the sample files different numbers of lines. First test the logic on one path: get its leaf name and wrap the file content in @() before reading Count.', 'The first file should report parallel-a.txt and 2. The second should report parallel-b.txt and 3.'],
    ['Return data from independent workers', 'Pipe the two paths into a ForEach-Object -Parallel block. Use $_ as the current path. Each worker returns one object with Name and Lines. Bound concurrency with -ThrottleLimit 2.', 'You should get two objects. Their arrival order can change, so inspect their values before relying on order.'],
    ['Sort after collecting results', 'Sort the result objects by Name and format only after sorting. Run again with the path order reversed.', 'Both runs should display the a file first, then the b file, with counts 2 and 3.'],
  ],
  'inventory-report': [
    ['Separate expected and observed state', 'Store the desired state by service name. Build a second lookup from the inventory sample, keyed by the same name.', 'Look up LabWeb and LabQueue in both tables. LabExtra belongs to the actual inventory only.'],
    ['Identify the exception type', 'Iterate through the expected names. If a name is absent from the actual lookup, emit a Missing record. Otherwise emit a record only if status differs from what was expected.', 'For the first sample, only LabQueue should appear and it should be Stopped. Remove that record from the input and verify the state becomes Missing.'],
    ['Export and read back the exceptions', 'Keep the exceptions as objects with Name and State until they reach Export-Csv. Read the file again before formatting the output.', 'The file should have Name and State columns. The output should represent what was actually persisted.'],
  ],
  'automation-capstone': [
    ['Make the report data correct on its own', 'Accept a threshold in the function and produce records in ascending quantity order. Convert those records to CSV lines in memory before touching the destination.', 'At threshold 2, the CSV rows should be Adapter at 1 and Cable at 2. At threshold 0, keep the header and produce no item rows.'],
    ['Make changes conditional', 'Compare the proposed lines with the existing file’s lines. If the report already matches, return without writing. Put the write behind ShouldProcess and make file errors terminating.', 'Preview against a fresh path should leave it absent. A real run should create it. Rerunning with the same settings should report Already current.'],
    ['Add an unattended entry point', 'Put Threshold, Destination, and Preview in a script param block. Pass Preview to the function’s WhatIf switch. Return process status 0 for a successful call and nonzero if the function fails.', 'Run through pwsh -NoProfile -NonInteractive -File with an explicit path. Confirm an out-of-range threshold returns a nonzero status without writing.'],
    ['Verify the persisted result', 'After generating the report, import the CSV and check the ordered names and quantities. Narrow the threshold and check the file again rather than trusting the status message.', 'At threshold 2 the file should have exactly two data rows. At threshold 1 only Adapter should remain.'],
  ],
};
