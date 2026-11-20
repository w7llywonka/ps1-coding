units.push(
  {
    title: 'Types, keys, and patterns',
    goal: 'Choose how to represent data, convert input safely, and match text.',
    references: [
      ['PowerShell language reference', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/'],
      ['Everything about hashtables', 'https://learn.microsoft.com/powershell/scripting/learn/deep-dives/everything-about-hashtable'],
    ],
    lessons: [
      {
        id: 'types', title: 'Types, conversions, and missing values', time: 14,
        intro: 'Decide when input should stay text and when it needs to become a number.',
        notes: [
          'Use .GetType().Name to inspect a value. [int] converts compatible text to a whole number. An invalid cast raises an error.',
          'The -as operator returns $null if the conversion fails. Put $null on the left of -eq when checking for missing values. Zero is a valid number, so test for $null explicitly.',
        ],
        file: 'types.ps1',
        example: `$amount = "7" -as [int]
Write-Output $amount.GetType().Name
Write-Output ($amount + 2)`,
        exampleOutput: 'Int32\n9',
        practice: [
          {
            title: 'Compare text and numeric addition',
            task: 'Start with the text "12". Print what happens when you add the text "3", then convert "12" to an integer and add the number 3.',
            expected: '123\n15',
            hint: 'Use two expressions. The second can use ([int]$amount) + 3.',
            solution: `$amount = "12"
Write-Output ($amount + "3")
Write-Output (([int]$amount) + 3)`,
          },
          {
            title: 'Tell zero from invalid text',
            review: 'Unit 2 · Arrays, foreach, and if/else',
            task: 'Try to convert "0", "tea", and "5". Print the result for successful conversions and “Invalid: tea” for the failed one.',
            expected: '0\nInvalid: tea\n5',
            hint: 'Inside the loop, store the result of -as [int] and compare it to $null before printing.',
            solution: `foreach ($value in @("0", "tea", "5")) {
    $number = $value -as [int]
    if ($null -eq $number) {
        Write-Output "Invalid: $value"
    } else {
        Write-Output $number
    }
}`,
          },
        ],
      },
      {
        id: 'hashtables', title: 'Hashtables and splatting', time: 14,
        intro: 'Look up values by name and pass a group of named parameters at once.',
        notes: [
          'A hashtable uses @{ key = value }. Access a value with brackets. Use ContainsKey to distinguish a missing key from a key whose value is $null.',
          'Splat a hashtable with @name in a command call. Its keys must match parameter names. This is useful when options are assembled before the call.',
        ],
        file: 'hashtables.ps1',
        example: `$prices = @{ Tea = 3; Coffee = 4 }
$options = @{ InputObject = $prices["Tea"] }
Write-Output @options`,
        exampleOutput: '3',
        practice: [
          {
            title: 'Add and look up an entry',
            task: 'Start with Tea = 3. Add Coffee = 4 using bracket assignment, then print the value for Coffee and the number of keys.',
            expected: '4\n2',
            hint: 'Use $prices["Coffee"] = 4 and read .Count.',
            solution: `$prices = @{ Tea = 3 }
$prices["Coffee"] = 4
Write-Output $prices["Coffee"]
Write-Output $prices.Count`,
          },
          {
            title: 'Splat options into a sort',
            review: 'Unit 3 · Sorting; Unit 2 · Arrays',
            task: 'Put the Descending and Unique switches in an options hashtable. Sort the array 2, 8, 4, 8 in descending order without duplicates by passing that hashtable to Sort-Object.',
            expected: '8\n4\n2',
            hint: 'Set both switches to $true in the hashtable. Send individual numbers through the pipeline and use @options on Sort-Object.',
            solution: `$options = @{ Descending = $true; Unique = $true }
@(2, 8, 4, 8) | Sort-Object @options`,
          },
        ],
      },
      {
        id: 'patterns', title: 'Switch, wildcards, and regular expressions', time: 16,
        intro: 'Recognize valid input and handle several named cases.',
        notes: [
          'Use -like for wildcards such as *.txt. Use -match for regular expressions. ^ and $ anchor the start and end, [0-9] matches a digit, and {2} means exactly twice.',
          'A switch checks cases and can use a default block. PowerShell can run every matching case unless you use break. The cases below are mutually exclusive.',
        ],
        file: 'patterns.ps1',
        example: `Write-Output ("AB-04" -match "^[A-Z]{2}-[0-9]{2}$")
switch ("draft") {
    "draft" { "Keep editing." }
    "ready" { "Send for review." }
    default { "Unknown status." }
}`,
        exampleOutput: 'True\nKeep editing.',
        practice: [
          {
            title: 'Match names with a wildcard',
            task: 'Loop over notes.txt, image.png, and draft.txt. Print only names that end in .txt using -like.',
            expected: 'notes.txt\ndraft.txt',
            hint: 'Use the pattern "*.txt" in an if block.',
            solution: `foreach ($name in @("notes.txt", "image.png", "draft.txt")) {
    if ($name -like "*.txt") { $name }
}`,
          },
          {
            title: 'Validate and route tickets',
            review: 'Unit 2 · Arrays and loops',
            task: 'Loop over BUG-12, DOC-03, and BUG-7. With switch -Regex, print “Bug” for BUG plus two digits, “Docs” for DOC plus two digits, and “Invalid” otherwise.',
            expected: 'Bug\nDocs\nInvalid',
            hint: 'Use patterns such as ^BUG-[0-9]{2}$ as cases. Use default for everything else.',
            solution: `foreach ($ticket in @("BUG-12", "DOC-03", "BUG-7")) {
    switch -Regex ($ticket) {
        "^BUG-[0-9]{2}$" { "Bug" }
        "^DOC-[0-9]{2}$" { "Docs" }
        default { "Invalid" }
    }
}`,
          },
        ],
      },
      {
        id: 'dotnet', title: 'Use .NET methods and collections', time: 17,
        intro: 'Use built-in .NET types when a cmdlet or array does not fit the job.',
        notes: [
          'A method belongs to an object or a type. Call instance methods with a dot, such as $text.Trim(). Call static methods with ::, such as [Math]::Round(4.6).',
          'A PowerShell array has a fixed length. To collect a changing number of typed values, construct a List with ::new() and add items with .Add(). Use .Count to see how many have been added.',
        ],
        file: 'dotnet.ps1',
        example: `$names = [System.Collections.Generic.List[string]]::new()
$names.Add("  Mira  ".Trim())
$names.Add("Ari")
$names.Count
$names[0]`,
        exampleOutput: '2\nMira',
        practice: [
          {
            title: 'Round a calculation',
            task: 'Divide 7 by 3. Use the static Math.Round method to round the result to two decimal places.',
            expected: '2.33',
            hint: 'Call [Math]::Round with the quotient and 2 as separate method arguments.',
            solution: '[Math]::Round((7 / 3), 2)',
          },
          {
            title: 'Keep only meaningful names',
            review: 'Unit 2 · Lists, loops, and conditions',
            task: 'Loop through "  Mira  ", "   ", and "Ari". Trim each name and add it to a typed string list only if it is nonempty. Print the list count and the names.',
            expected: '2\nMira\nAri',
            hint: 'Store the result of .Trim() in $clean. Call .Add($clean) only if $clean.Length is greater than zero.',
            solution: `$names = [System.Collections.Generic.List[string]]::new()
foreach ($name in @("  Mira  ", "   ", "Ari")) {
    $clean = $name.Trim()
    if ($clean.Length -gt 0) { $names.Add($clean) }
}
$names.Count
$names`,
          },
        ],
      },
      {
        id: 'inventory-challenge', title: 'Challenge: inventory codes', time: 20, challenge: true,
        intro: 'Check input, look up a price, and calculate an order total.',
        file: 'inventory-code.ps1',
        practice: [{
          title: 'Price a valid order',
          review: 'Unit 4 · Patterns, keys, and conversion. Units 1–2 · Math, input, and decisions.',
          task: 'Use a hashtable with TEA-01 at 3 and MUG-02 at 7. Ask for a Code and Quantity. A code must match three letters, a dash, and two digits, and must exist in the catalog. The quantity must convert to a positive integer. Print the total for TEA-01 and 4, then test with BAD and 4.',
          expected: 'Code: TEA-01\nQuantity: 4\nTotal: 12\n\nCode: BAD\nQuantity: 4\nInvalid order.',
          expectedLabel: 'Two runs separated by a blank line',
          hint: 'Build $validCode with -match and ContainsKey joined by -and. Convert the quantity with -as [int], then check $validCode and whether the quantity is greater than 0. Return a clear message when any check fails.',
          solution: `$prices = @{ "TEA-01" = 3; "MUG-02" = 7 }
$code = Read-Host "Code"
$quantity = (Read-Host "Quantity") -as [int]
$validCode = $code -match "^[A-Z]{3}-[0-9]{2}$" -and $prices.ContainsKey($code)
if ($validCode -and $quantity -gt 0) {
    $total = $prices[$code] * $quantity
    "Total: $total"
} else {
    "Invalid order."
}`,
        }],
      },
    ],
  },
  {
    title: 'Objects and pipelines',
    goal: 'Build, inspect, filter, and summarize objects before deciding how to display them.',
    references: [
      ['About pipelines', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_pipelines'],
      ['Discovering objects with Get-Member', 'https://learn.microsoft.com/powershell/scripting/learn/ps101/03-discovering-objects'],
    ],
    lessons: [
      {
        id: 'objects', title: 'Inspect and create objects', time: 14,
        intro: 'Keep related fields together so commands can use them individually.',
        notes: [
          'Pipe a value to Get-Member to see its properties and methods. A property stores information. A method performs an operation when called with parentheses.',
          '[pscustomobject] turns a hashtable-style literal into an object with named properties. Access a property with a dot.',
        ],
        file: 'objects.ps1',
        example: `$task = [pscustomobject]@{ Name = "Pack"; Minutes = 10 }
$task | Get-Member -Name Minutes | Select-Object -ExpandProperty MemberType
Write-Output $task.Name`,
        exampleOutput: 'NoteProperty\nPack',
        practice: [
          {
            title: 'Create a record and inspect a field',
            task: 'Create a book with Title = "Dune" and Pages = 412. Print the title and the type name of the Pages value.',
            expected: 'Dune\nInt32',
            hint: 'Use $book.Title and $book.Pages.GetType().Name.',
            solution: `$book = [pscustomobject]@{ Title = "Dune"; Pages = 412 }
$book.Title
$book.Pages.GetType().Name`,
          },
          {
            title: 'Build a list of records',
            review: 'Unit 2 · foreach; Unit 1 · Math',
            task: 'For quantities 2 and 5, create one object per quantity with Quantity and Cost, charging 4 per item. Keep the objects in a variable and print their Cost values using Select-Object -ExpandProperty.',
            expected: '8\n20',
            hint: 'Use $orders = foreach (...) and output a custom object on each turn of the loop.',
            solution: `$orders = foreach ($quantity in @(2, 5)) {
    [pscustomobject]@{ Quantity = $quantity; Cost = $quantity * 4 }
}
$orders | Select-Object -ExpandProperty Cost`,
          },
        ],
      },
      {
        id: 'filter-project', title: 'Filter and transform objects', time: 16,
        intro: 'Choose which objects continue and which properties they carry.',
        notes: [
          'Where-Object passes along objects that satisfy a condition. In its script block, $_ is the current object.',
          'Select-Object chooses properties. -ExpandProperty extracts the raw value. ForEach-Object can create any new value from the current object.',
        ],
        file: 'filter-project.ps1',
        example: `$tasks = @(
    [pscustomobject]@{ Name = "Pack"; Minutes = 10 }
    [pscustomobject]@{ Name = "Ship"; Minutes = 25 }
)
$tasks | Where-Object { $_.Minutes -ge 15 } | Select-Object -ExpandProperty Name`,
        exampleOutput: 'Ship',
        practice: [
          {
            title: 'Filter at a boundary',
            task: 'Filter the numbers 2, 5, 9, and 3 to keep numbers greater than or equal to 5.',
            expected: '5\n9',
            hint: 'Use $_ directly when each pipeline item is a number.',
            solution: '@(2, 5, 9, 3) | Where-Object { $_ -ge 5 }',
          },
          {
            title: 'Filter, sort, and label tasks',
            review: 'Unit 3 · Sorting; Unit 1 · Text',
            task: 'Create records for Pack (10 minutes), Ship (25), and Audit (20). Keep tasks of at least 20 minutes, sort by Minutes descending, and format each remaining record as shown.',
            expected: 'Ship takes 25 min\nAudit takes 20 min',
            hint: 'Sort before turning the objects into strings. Use $($_.Name) and $($_.Minutes) to evaluate property expressions inside a double-quoted string.',
            solution: `$tasks = @(
    [pscustomobject]@{ Name = "Pack"; Minutes = 10 }
    [pscustomobject]@{ Name = "Ship"; Minutes = 25 }
    [pscustomobject]@{ Name = "Audit"; Minutes = 20 }
)
$tasks | Where-Object { $_.Minutes -ge 20 } |
    Sort-Object -Property Minutes -Descending |
    ForEach-Object { "$($_.Name) takes $($_.Minutes) min" }`,
          },
        ],
      },
      {
        id: 'group-measure', title: 'Group, measure, and format', time: 16,
        intro: 'Reduce a collection to useful totals and apply formatting at the end.',
        notes: [
          'Group-Object creates one group per distinct property value. Each group has Name, Count, and Group, which contains its original objects.',
          'Measure-Object calculates statistics such as Count and Sum. Format-Table changes data into display instructions. Keep formatting at the end, after calculations and export.',
        ],
        file: 'measure.ps1',
        example: `$items = @(
    [pscustomobject]@{ Category = "Books"; Cost = 5 }
    [pscustomobject]@{ Category = "Books"; Cost = 7 }
)
$total = $items | Measure-Object -Property Cost -Sum
Write-Output $total.Sum`,
        exampleOutput: '12',
        practice: [
          {
            title: 'Measure a list of numbers',
            task: 'Measure 2, 4, and 6 with -Sum and -Average. Print the sum and average on separate lines.',
            expected: '12\n4',
            hint: 'Assign the measurement to a variable and read .Sum and .Average.',
            solution: `$stats = @(2, 4, 6) | Measure-Object -Sum -Average
$stats.Sum
$stats.Average`,
          },
          {
            title: 'Make one summary per category',
            review: 'Unit 2 · Loops and arrays; this unit · Objects',
            task: 'Group records for Books at 5, Games at 4, and Books at 7. Sort groups by name and print the total cost of each group.',
            expected: 'Books: 12\nGames: 4',
            hint: 'Send $group.Group to Measure-Object. Use $($group.Name) inside the output string.',
            solution: `$items = @(
    [pscustomobject]@{ Category = "Books"; Cost = 5 }
    [pscustomobject]@{ Category = "Games"; Cost = 4 }
    [pscustomobject]@{ Category = "Books"; Cost = 7 }
)
$groups = $items | Group-Object -Property Category | Sort-Object Name
foreach ($group in $groups) {
    $stats = $group.Group | Measure-Object -Property Cost -Sum
    "$($group.Name): $($stats.Sum)"
}`,
          },
        ],
      },
      {
        id: 'timesheet-challenge', title: 'Challenge: timesheet summary', time: 22, challenge: true,
        intro: 'Clean time entries and turn the remaining objects into ranked totals.',
        file: 'timesheet.ps1',
        practice: [{
          title: 'Rank teams by total minutes',
          review: 'Unit 5 · Objects, filtering, grouping, and measurement. Units 2–4 · Conditions, sorting, types.',
          task: 'Create rows for Web at 10, Ops at 5, Web at 20, and Ops at 0. Drop rows with nonpositive minutes. Group by team, create a new object per team with its total and valid entry count, then sort those summaries by total descending. Change Web’s 20 to 0 and confirm its total and count both drop.',
          expected: 'Web: 30 min (2 entries)\nOps: 5 min (1 entries)\n\nWeb: 10 min (1 entries)\nOps: 5 min (1 entries)',
          expectedLabel: 'Original run, then run with the 20-minute entry changed to 0',
          hint: 'Filter before grouping. Use $group.Count for the entry count and Measure-Object for minutes. Create summary objects before sorting and formatting.',
          solution: `$entries = @(
    [pscustomobject]@{ Team = "Web"; Minutes = 10 }
    [pscustomobject]@{ Team = "Ops"; Minutes = 5 }
    [pscustomobject]@{ Team = "Web"; Minutes = 20 }
    [pscustomobject]@{ Team = "Ops"; Minutes = 0 }
)
$groups = $entries | Where-Object { $_.Minutes -gt 0 } | Group-Object Team
$summary = foreach ($group in $groups) {
    $stats = $group.Group | Measure-Object -Property Minutes -Sum
    [pscustomobject]@{ Team = $group.Name; Total = $stats.Sum; Count = $group.Count }
}
$summary | Sort-Object Total -Descending |
    ForEach-Object { "$($_.Team): $($_.Total) min ($($_.Count) entries)" }`,
        }],
      },
    ],
  },
  {
    title: 'Files and structured data',
    goal: 'Work with portable paths, discover files, and round-trip objects through CSV and JSON.',
    references: [
      ['About providers', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_providers'],
      ['Export-Csv', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.utility/export-csv'],
      ['ConvertTo-Json', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.utility/convertto-json'],
    ],
    lessons: [
      {
        id: 'paths', title: 'Paths, providers, and file discovery', time: 15,
        intro: 'Build paths that work across operating systems and find files by extension.',
        notes: [
          'Join-Path combines path segments. $PSScriptRoot is the folder that contains the running script. Use it for files that belong beside the script.',
          'Get-ChildItem lists items through the current provider. The FileSystem provider supports -File and -Recurse. Try Get-PSProvider to discover other providers, such as Environment.',
        ],
        file: 'paths.ps1',
        example: `$path = Join-Path $PSScriptRoot "path-example.txt"
Set-Content -LiteralPath $path -Value "Sample"
Write-Output (Test-Path -LiteralPath $path -PathType Leaf)`,
        exampleOutput: 'True',
        practice: [
          {
            title: 'Read a path built beside the script',
            task: 'Use Join-Path to write “Local note” to path-note.txt beside the script. Read the note back using the same variable.',
            expected: 'Local note',
            hint: 'Pass the joined path to both Set-Content and Get-Content as -LiteralPath.',
            solution: `$path = Join-Path $PSScriptRoot "path-note.txt"
Set-Content -LiteralPath $path -Value "Local note"
Get-Content -LiteralPath $path`,
          },
          {
            title: 'Inventory only text files',
            review: 'Unit 5 · Filtering, sorting, and selecting properties',
            task: 'Create a folder called path-lab beside your script. Write a.txt, b.txt, and photo.log inside it. Use Get-ChildItem and a pipeline to print the names of just the .txt files, sorted by name.',
            expected: 'a.txt\nb.txt',
            hint: 'Use Get-ChildItem -LiteralPath $folder -File, filter on Extension, and extract Name.',
            solution: `$folder = Join-Path $PSScriptRoot "path-lab"
$null = New-Item -ItemType Directory -Path $folder -Force
foreach ($name in @("a.txt", "b.txt", "photo.log")) {
    Set-Content -LiteralPath (Join-Path $folder $name) -Value "demo"
}
Get-ChildItem -LiteralPath $folder -File |
    Where-Object { $_.Extension -eq ".txt" } |
    Sort-Object Name |
    Select-Object -ExpandProperty Name`,
          },
        ],
      },
      {
        id: 'csv', title: 'Import and export CSV', time: 15,
        intro: 'Exchange rows of data with a spreadsheet or another script.',
        notes: [
          'Export-Csv writes object properties as columns. Import-Csv uses the header to name properties and imports numbers as text.',
          'Convert a numeric column before sorting or calculating. With text sorting, "10" can sort before "2".',
        ],
        file: 'csv.ps1',
        example: `$path = Join-Path $PSScriptRoot "csv-example.csv"
[pscustomobject]@{ Name = "Rin"; Score = 9 } |
    Export-Csv -LiteralPath $path -NoTypeInformation
$row = Import-Csv -LiteralPath $path
Write-Output "$($row.Name): $([int]$row.Score + 1)"`,
        exampleOutput: 'Rin: 10',
        practice: [
          {
            title: 'Round-trip one row',
            task: 'Export a row with Item "Cable" and Quantity 2. Import the file and print the quantity’s type name.',
            expected: 'String',
            hint: 'Inspect $row.Quantity.GetType().Name after importing.',
            solution: `$path = Join-Path $PSScriptRoot "csv-item.csv"
[pscustomobject]@{ Item = "Cable"; Quantity = 2 } |
    Export-Csv -LiteralPath $path -NoTypeInformation
$row = Import-Csv -LiteralPath $path
$row.Quantity.GetType().Name`,
          },
          {
            title: 'Sort quantities as numbers',
            review: 'Unit 4 · Casts; Unit 5 · Properties and sorting',
            task: 'Make a CSV with Cable at quantity 2 and Plug at 10. Import it and display the item names in ascending numeric quantity order.',
            expected: 'Cable\nPlug',
            hint: 'Use Sort-Object -Property { [int]$_.Quantity } before expanding Item.',
            solution: `$path = Join-Path $PSScriptRoot "csv-quantities.csv"
@(
    [pscustomobject]@{ Item = "Cable"; Quantity = 2 }
    [pscustomobject]@{ Item = "Plug"; Quantity = 10 }
) | Export-Csv -LiteralPath $path -NoTypeInformation
Import-Csv -LiteralPath $path |
    Sort-Object -Property { [int]$_.Quantity } |
    Select-Object -ExpandProperty Item`,
          },
        ],
      },
      {
        id: 'json', title: 'Read and write nested JSON', time: 15,
        intro: 'Store objects that contain other objects or lists.',
        notes: [
          'ConvertFrom-Json turns JSON text into PowerShell data. Read a whole JSON file as one string with Get-Content -Raw.',
          'ConvertTo-Json writes PowerShell data as JSON. Set -Depth high enough for nested properties so those fields survive the round trip.',
        ],
        file: 'json.ps1',
        example: `$text = '{"course":{"name":"PowerShell","units":[1,2,3]}}'
$data = $text | ConvertFrom-Json
Write-Output $data.course.name
Write-Output $data.course.units.Count`,
        exampleOutput: 'PowerShell\n3',
        practice: [
          {
            title: 'Read one item from nested JSON',
            task: 'Parse {"album":{"tracks":["Intro","Finale"]}}. Print the second track.',
            expected: 'Finale',
            hint: 'Use a single-quoted string for the JSON text. Access .album.tracks[1].',
            solution: `$data = '{"album":{"tracks":["Intro","Finale"]}}' | ConvertFrom-Json
$data.album.tracks[1]`,
          },
          {
            title: 'Save and load nested settings',
            review: 'Unit 4 · Hashtables; this unit · Portable paths',
            task: 'Make settings with a nested display object containing Theme = "Light" and Sizes = 12, 16. Save it to display-settings.json and read it back. Print the theme and last size.',
            expected: 'Light\n16',
            hint: 'Convert with -Depth 4, then use Get-Content -Raw before ConvertFrom-Json.',
            solution: `$path = Join-Path $PSScriptRoot "display-settings.json"
$config = @{ Display = @{ Theme = "Light"; Sizes = @(12, 16) } }
$config | ConvertTo-Json -Depth 4 | Set-Content -LiteralPath $path
$loaded = Get-Content -LiteralPath $path -Raw | ConvertFrom-Json
$loaded.Display.Theme
$loaded.Display.Sizes[1]`,
          },
        ],
      },
      {
        id: 'data-conversion-challenge', title: 'Challenge: stock data conversion', time: 24, challenge: true,
        intro: 'Read a spreadsheet-style file and export a typed JSON report.',
        file: 'stock-data.ps1',
        practice: [{
          title: 'Export the low-stock rows',
          review: 'Unit 6 · CSV, JSON, and paths. Units 4–5 · Numeric conversion, objects, and filtering.',
          task: 'Create stock-input.csv with Cable at 2, Plug at 10, and Adapter at 1. Import the rows, keep quantities of 2 or fewer, sort them numerically, and export each item and numeric quantity to stock-low.json. Read it back and print the names, quantities, and quantity type. Then change the threshold to 1 and check that only Adapter appears.',
          expected: 'Adapter: 1 (Int64)\nCable: 2 (Int64)\n\nAdapter: 1 (Int64)',
          expectedLabel: 'PowerShell 7 output at thresholds 2 and 1',
          hint: 'Cast quantities while making clean objects. Wrap the filtered pipeline in @() and pass the array with ConvertTo-Json -InputObject so JSON stays an array even with one result.',
          solution: `$threshold = 2
$csvPath = Join-Path $PSScriptRoot "stock-input.csv"
$jsonPath = Join-Path $PSScriptRoot "stock-low.json"
@(
    [pscustomobject]@{ Item = "Cable"; Quantity = 2 }
    [pscustomobject]@{ Item = "Plug"; Quantity = 10 }
    [pscustomobject]@{ Item = "Adapter"; Quantity = 1 }
) | Export-Csv -LiteralPath $csvPath -NoTypeInformation
$rows = @(Import-Csv -LiteralPath $csvPath | ForEach-Object {
    [pscustomobject]@{ Item = $_.Item; Quantity = [int]$_.Quantity }
} | Where-Object { $_.Quantity -le $threshold } | Sort-Object Quantity)
ConvertTo-Json -InputObject $rows -Depth 3 | Set-Content -LiteralPath $jsonPath
$loaded = Get-Content -LiteralPath $jsonPath -Raw | ConvertFrom-Json
foreach ($row in $loaded) {
    "$($row.Item): $($row.Quantity) ($($row.Quantity.GetType().Name))"
}`,
        }],
      },
    ],
  },
);

units.push(
  {
    title: 'Functions, modules, and classes',
    goal: 'Build reusable commands that accept validated input and work in a pipeline.',
    references: [
      ['Advanced functions', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_functions_advanced'],
      ['How to write a script module', 'https://learn.microsoft.com/powershell/scripting/developer/module/how-to-write-a-powershell-script-module'],
      ['PowerShell classes', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_classes'],
    ],
    lessons: [
      {
        id: 'advanced-functions', title: 'Validate parameters and accept pipeline input', time: 18,
        intro: 'Define what your function accepts and what happens for each pipeline item.',
        notes: [
          '[CmdletBinding()] adds common parameters. Type constraints and validation attributes describe what arguments can be accepted. Mandatory parameters must be supplied.',
          'ValueFromPipeline binds one item at a time. begin runs once before processing, process runs for every item, and end runs once afterward.',
        ],
        file: 'advanced-function.ps1',
        example: `function Get-Square {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [ValidateRange(0, 100)]
        [int]$Number
    )
    process { $Number * $Number }
}
@(2, 5) | Get-Square`,
        exampleOutput: '4\n25',
        practice: [
          {
            title: 'Validate a named parameter',
            task: 'Write Get-Servings with an integer Portions parameter from 1 through 10. Return twice that number. Call it with 3, then try 0 separately to see the validation error.',
            expected: '6',
            expectedLabel: 'Output for an accepted value',
            hint: 'Attach [ValidateRange(1, 10)] above [int]$Portions in the param block.',
            solution: `function Get-Servings {
    [CmdletBinding()]
    param([ValidateRange(1, 10)][int]$Portions)
    $Portions * 2
}
Get-Servings -Portions 3`,
          },
          {
            title: 'Accumulate a pipeline',
            review: 'Unit 2 · Running totals; Unit 5 · Pipelines',
            task: 'Write Get-NumberTotal with a mandatory, validated integer pipeline parameter from 0 through 100. Initialize a total once, add each item, and output only the final total for 2, 3, and 5.',
            expected: '10',
            hint: 'Initialize in begin, update inside process, and emit the value in end.',
            solution: `function Get-NumberTotal {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [ValidateRange(0, 100)]
        [int]$Number
    )
    begin { $total = 0 }
    process { $total = $total + $Number }
    end { $total }
}
@(2, 3, 5) | Get-NumberTotal`,
          },
        ],
      },
      {
        id: 'scope', title: 'Understand scope and script parameters', time: 16,
        intro: 'Pass data across script and function boundaries without depending on shared variables.',
        notes: [
          'Functions have a local scope. They can read variables in parent scopes, but ordinary assignment inside a function creates or changes a local variable.',
          'Run another script with & and pass its parameters explicitly. Dot-sourcing with . runs a trusted script in your current scope, where its functions and assignments persist. Prefer modules for reusable libraries.',
          'A param block at the top of a script defines arguments. [switch] enables a flag such as -Upper without needing a separate value.',
        ],
        file: 'scope.ps1',
        example: `$label = "outer"
function Get-LabLabel {
    $label = "inner"
    $label
}
Get-LabLabel
$label`,
        exampleOutput: 'inner\nouter',
        practice: [
          {
            title: 'Pass a value instead of changing outer state',
            task: 'Set $name to Ada in the caller. Make a function with a Name parameter that returns a greeting. Pass the caller’s value and print it again after the function call.',
            expected: 'Hello, Ada\nAda',
            hint: 'Use param([string]$Name) in the function, then call it with -Name $name.',
            solution: `function Get-LabGreeting {
    param([string]$Name)
    "Hello, $Name"
}
$name = "Ada"
Get-LabGreeting -Name $name
$name`,
          },
          {
            title: 'Give a child script a switch',
            review: 'Unit 4 · Methods; Unit 6 · File paths',
            task: 'Create a child script beside yours that takes a Note and an optional -Upper switch. Call it twice with “Ready”, once without the switch and once with it. Keep the child’s variables in its own scope.',
            expected: 'Ready\nREADY',
            hint: 'Use a single-quoted here-string for the child script. Inside it use .ToUpperInvariant() only when the switch is set. Call it through & $path.',
            solution: `$path = Join-Path $PSScriptRoot "scope-lab-child.ps1"
@'
param([string]$Note, [switch]$Upper)
if ($Upper) { $Note.ToUpperInvariant() } else { $Note }
'@ | Set-Content -LiteralPath $path
& $path -Note "Ready"
& $path -Note "Ready" -Upper`,
          },
        ],
      },
      {
        id: 'modules', title: 'Package commands in a module', time: 18,
        intro: 'Give related commands a reusable home and control what callers see.',
        notes: [
          'A .psm1 file is a script module. Import-Module loads it and Export-ModuleMember controls which functions it exposes. The module’s internal functions and variables have their own scope.',
          'Distributable modules commonly include a .psd1 manifest. New-ModuleManifest creates one. RootModule points to the entry file, and ModuleVersion describes its version.',
        ],
        file: 'modules.ps1',
        example: `$modulePath = Join-Path $PSScriptRoot "GreetingLab.psm1"
@'
function Get-Greeting {
    param([string]$Name)
    "Hello, $Name!"
}
Export-ModuleMember -Function Get-Greeting
'@ | Set-Content -LiteralPath $modulePath
Import-Module $modulePath -Force
Get-Greeting -Name Ana`,
        exampleOutput: 'Hello, Ana!',
        practice: [
          {
            title: 'Import your own conversion command',
            task: 'Create a MinutesLab.psm1 module containing ConvertTo-Minutes. Export it, import the module, and convert 2 hours with the exported command.',
            expected: '120',
            hint: 'Use the here-string pattern from the example to write the module. Multiply $Hours by 60 inside it.',
            solution: `$path = Join-Path $PSScriptRoot "MinutesLab.psm1"
@'
function ConvertTo-Minutes {
    param([int]$Hours)
    $Hours * 60
}
Export-ModuleMember -Function ConvertTo-Minutes
'@ | Set-Content -LiteralPath $path
Import-Module $path -Force
ConvertTo-Minutes -Hours 2`,
          },
          {
            title: 'Expose one command through a manifest',
            review: 'Unit 6 · Paths; this unit · Parameterized commands',
            task: 'Make a module with Get-PackTotal and an internal Get-PackSize that returns 6. Export only Get-PackTotal. Create a manifest for version 1.0.0 and import through it. List public commands, then compute the total for 4 packs.',
            expected: '1.0.0\nGet-PackTotal\n24',
            hint: 'List exported names with Get-Command -Module PackLab. The public function can call the internal one inside the same module.',
            solution: `$modulePath = Join-Path $PSScriptRoot "PackLab.psm1"
$manifestPath = Join-Path $PSScriptRoot "PackLab.psd1"
@'
function Get-PackSize { 6 }
function Get-PackTotal {
    param([int]$Packs)
    $Packs * (Get-PackSize)
}
Export-ModuleMember -Function Get-PackTotal
'@ | Set-Content -LiteralPath $modulePath
New-ModuleManifest -Path $manifestPath -RootModule "PackLab.psm1" -ModuleVersion "1.0.0" -FunctionsToExport "Get-PackTotal"
Import-Module $manifestPath -Force
(Get-Module PackLab).Version.ToString()
(Get-Command -Module PackLab).Name
Get-PackTotal -Packs 4`,
          },
        ],
      },
      {
        id: 'classes', title: 'Define an enum and a class', time: 16,
        intro: 'Model a fixed set of choices and attach behavior to typed data.',
        notes: [
          'An enum names the allowed values. Use [EnumName]::Value to select one.',
          'A class defines properties and methods. A constructor initializes a new instance, and $this refers to that instance. Typed methods use return to send back their result.',
        ],
        file: 'classes.ps1',
        example: `enum TaskState { Draft; Ready }
class TaskCard {
    [string]$Name
    [TaskState]$State
    TaskCard([string]$name) {
        $this.Name = $name
        $this.State = [TaskState]::Draft
    }
    [string] Describe() {
        return "$($this.Name): $($this.State)"
    }
}
$task = [TaskCard]::new("Pack")
$task.Describe()`,
        exampleOutput: 'Pack: Draft',
        practice: [
          {
            title: 'Update an enum property',
            task: 'Take the example, set the task state to Ready after construction, and print Describe().',
            expected: 'Pack: Ready',
            hint: 'Assign [TaskState]::Ready to $task.State.',
            solution: `enum TaskState { Draft; Ready }
class TaskCard {
    [string]$Name
    [TaskState]$State
    TaskCard([string]$name) {
        $this.Name = $name
        $this.State = [TaskState]::Draft
    }
    [string] Describe() {
        return "$($this.Name): $($this.State)"
    }
}
$task = [TaskCard]::new("Pack")
$task.State = [TaskState]::Ready
$task.Describe()`,
          },
          {
            title: 'Create and filter typed tasks',
            review: 'Unit 5 · Filtering and method calls',
            task: 'Use a TaskCard class and TaskState enum to create two objects. Mark only Ship as Ready, then print the names of tasks that are ready.',
            expected: 'Ship',
            hint: 'Compare $_.State to [TaskState]::Ready in Where-Object. Expand Name after the filter.',
            solution: `enum TaskState { Draft; Ready }
class TaskCard {
    [string]$Name
    [TaskState]$State
    TaskCard([string]$name) {
        $this.Name = $name
        $this.State = [TaskState]::Draft
    }
}
$pack = [TaskCard]::new("Pack")
$ship = [TaskCard]::new("Ship")
$ship.State = [TaskState]::Ready
@($pack, $ship) | Where-Object { $_.State -eq [TaskState]::Ready } |
    Select-Object -ExpandProperty Name`,
          },
        ],
      },
      {
        id: 'module-challenge', title: 'Challenge: reusable score commands', time: 25, challenge: true,
        intro: 'Separate a reusable calculation from presentation and package it for another script.',
        file: 'score-module.ps1',
        practice: [{
          title: 'Export a validated pipeline command',
          review: 'Unit 7 · Parameters, pipeline binding, and modules. Units 2 and 5 · Conditions and objects.',
          task: 'Create ScoreLab.psm1 and export Get-ScoreResult. It should accept scores from 0 through 100 by pipeline and emit a record with Score and State. Scores of 60 or more are Pass. Import the module, run 59 and 60 through the command, then print both records. Finally try 101 separately and observe the validation error.',
          expected: '59: Retry\n60: Pass',
          hint: 'In process, assign the state with if/else, then emit a custom object. Put the text formatting in the caller, so other scripts can use the raw object.',
          solution: `$path = Join-Path $PSScriptRoot "ScoreLab.psm1"
@'
function Get-ScoreResult {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory, ValueFromPipeline)]
        [ValidateRange(0, 100)]
        [int]$Score
    )
    process {
        $state = if ($Score -ge 60) { "Pass" } else { "Retry" }
        [pscustomobject]@{ Score = $Score; State = $state }
    }
}
Export-ModuleMember -Function Get-ScoreResult
'@ | Set-Content -LiteralPath $path
Import-Module $path -Force
@(59, 60) | Get-ScoreResult | ForEach-Object { "$($_.Score): $($_.State)" }`,
        }],
      },
    ],
  },
  {
    title: 'Errors, debugging, and tests',
    goal: 'Handle failures deliberately, trace execution, and verify behavior with repeatable tests.',
    references: [
      ['About try, catch, and finally', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_try_catch_finally'],
      ['About output streams', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_output_streams'],
      ['Pester documentation', 'https://pester.dev/docs/quick-start'],
      ['PSScriptAnalyzer documentation', 'https://learn.microsoft.com/powershell/utility-modules/psscriptanalyzer/overview'],
    ],
    lessons: [
      {
        id: 'errors', title: 'Handle errors with try, catch, and finally', time: 16,
        intro: 'Keep the normal case readable and decide what the script should do when something fails.',
        notes: [
          'catch handles terminating errors. Many cmdlets report nonterminating errors by default. Use -ErrorAction Stop on an operation that should trigger catch.',
          'Inside catch, $_ is an error record with properties such as Exception and FullyQualifiedErrorId. Use finally for cleanup that should run whether or not the operation succeeds.',
        ],
        file: 'errors.ps1',
        example: `try {
    $number = [int]"unknown"
    "Read $number"
} catch {
    "Could not read a number."
} finally {
    "Finished."
}`,
        exampleOutput: 'Could not read a number.\nFinished.',
        practice: [
          {
            title: 'Catch an explicit failure',
            task: 'Raise an error with throw. Catch it and print “Recovered”. Add a finally block that prints “Done” in both success and failure paths.',
            expected: 'Recovered\nDone',
            hint: 'Put throw "example failure" inside try, and put the final message in finally.',
            solution: `try {
    throw "example failure"
} catch {
    "Recovered"
} finally {
    "Done"
}`,
          },
          {
            title: 'Handle bad data and keep processing',
            review: 'Unit 4 · Numeric conversion; Unit 2 · Loops',
            task: 'Loop over "2", "bad", and "5". Try casting inside the loop, print the doubled amount when successful, and print a useful message when conversion fails.',
            expected: '4\nSkipped: bad\n10',
            hint: 'Place try/catch inside foreach to handle one item at a time. Store the item in $entry so you can still access it when $_ is an error record.',
            solution: `foreach ($entry in @("2", "bad", "5")) {
    try {
        $number = [int]$entry
        $number * 2
    } catch {
        "Skipped: $entry"
    }
}`,
          },
        ],
      },
      {
        id: 'diagnostics', title: 'Keep results separate from diagnostics', time: 15,
        intro: 'Send status and diagnostic messages to streams that callers can choose to display.',
        notes: [
          'Ordinary command output travels on stream 1. Errors, warnings, verbose output, debug output, and information use streams 2 through 6. A normal assignment captures success output.',
          'Use Write-Verbose inside a function with [CmdletBinding()] and call it with -Verbose when you want diagnostics. Set-PSBreakpoint, Get-PSCallStack, and the VS Code PowerShell debugger help inspect state at a specific line.',
        ],
        file: 'diagnostics.ps1',
        example: `function Get-LabTotal {
    [CmdletBinding()]
    param([int]$Count)
    Write-Verbose "Calculating total"
    $Count * 3
}
$result = Get-LabTotal -Count 4
"Captured total: $result"`,
        exampleOutput: 'Captured total: 12',
        practice: [
          {
            title: 'Capture only the successful value',
            task: 'Write a function that emits a verbose message and returns 7. Call it without -Verbose, then print the captured value.',
            expected: 'Captured: 7',
            hint: 'Use [CmdletBinding()] param() to enable -Verbose on the function.',
            solution: `function Get-LabValue {
    [CmdletBinding()]
    param()
    Write-Verbose "Returning the lab value"
    7
}
$value = Get-LabValue
"Captured: $value"`,
          },
          {
            title: 'Inspect verbose records on demand',
            review: 'Unit 7 · Advanced functions; Unit 5 · Object inspection',
            task: 'Use your function from the first problem. Run it with -Verbose and merge stream 4 into stream 1 with 4>&1. Print the type of the first captured entry and the second entry’s value.',
            expected: 'VerboseRecord\n7',
            hint: 'The capture now contains two values. Use [0].GetType().Name and [1].',
            solution: `function Get-LabValue {
    [CmdletBinding()]
    param()
    Write-Verbose "Returning the lab value"
    7
}
$records = @(Get-LabValue -Verbose 4>&1)
$records[0].GetType().Name
$records[1]`,
          },
        ],
      },
      {
        id: 'testing', title: 'Write repeatable tests', time: 18,
        intro: 'Check ordinary values, boundaries, and failures whenever the code changes.',
        notes: [
          'Arrange a known input, act by calling the function, and assert the result. A script can throw when an assertion fails so another process can detect the failure.',
          'Pester provides Describe and It blocks, assertions like Should -Be, and mocks for dependencies. These exercises use built-in PowerShell. Try the Pester quick start in the unit reference to run framework-based tests.',
        ],
        file: 'assertions.ps1',
        example: `function Get-StudyStatus {
    param([int]$Minutes)
    if ($Minutes -ge 20) { "Met" } else { "Short" }
}
$actual = Get-StudyStatus -Minutes 20
if ($actual -ne "Met") { throw "Expected Met at 20 minutes." }
"Assertion passed."`,
        exampleOutput: 'Assertion passed.',
        practice: [
          {
            title: 'Test both sides of a boundary',
            task: 'Test a function that returns “Full” at 10 or above and “Open” below 10. Assert the result with inputs 9 and 10, and print the success message only after both checks.',
            expected: '2 assertions passed.',
            hint: 'Use one if/throw for each result, and put the success message at the bottom.',
            solution: `function Get-LabBoxState {
    param([int]$Count)
    if ($Count -ge 10) { "Full" } else { "Open" }
}
if ((Get-LabBoxState -Count 9) -ne "Open") { throw "9 should be Open" }
if ((Get-LabBoxState -Count 10) -ne "Full") { throw "10 should be Full" }
"2 assertions passed."`,
          },
          {
            title: 'Run the same assertion for several cases',
            review: 'Unit 5 · Objects; Unit 2 · Loops',
            task: 'Test a function that doubles a number. Create case objects for 0 → 0, 3 → 6, and −2 → −4. Use one loop and name the failed input if any check fails.',
            expected: '3 assertions passed.',
            hint: 'Give each case an Input and Expected property, then pass .Input to the function and compare its result to .Expected.',
            solution: `function Get-LabDouble {
    param([int]$Number)
    $Number * 2
}
$cases = @(
    [pscustomobject]@{ Input = 0; Expected = 0 }
    [pscustomobject]@{ Input = 3; Expected = 6 }
    [pscustomobject]@{ Input = -2; Expected = -4 }
)
foreach ($case in $cases) {
    if ((Get-LabDouble -Number $case.Input) -ne $case.Expected) {
        throw "Failed input $($case.Input)"
    }
}
"$($cases.Count) assertions passed."`,
          },
        ],
      },
      {
        id: 'pester', title: 'Run a Pester test suite', time: 20,
        intro: 'Turn assertions into named tests that a developer or CI job can run repeatedly.',
        requirements: 'This lesson needs Pester 5. If it is missing, use the Pester quick start in the unit reference to install it for your user.',
        notes: [
          'Pester discovers tests inside .Tests.ps1 files. Describe groups related tests, It names one expected behavior, and BeforeAll makes helpers available during the run.',
          'Run Invoke-Pester -Path with -PassThru to inspect PassedCount and FailedCount. Use -CI in an automated run when a failing suite should produce a nonzero exit code.',
        ],
        file: 'pester-lab.ps1',
        example: `Import-Module -FullyQualifiedName @{ ModuleName = "Pester"; ModuleVersion = "5.0.0" }
$testPath = Join-Path $PSScriptRoot "PesterExample.Tests.ps1"
@'
Describe "Addition" {
    It "adds two positive numbers" {
        (2 + 3) | Should -Be 5
    }
}
'@ | Set-Content -LiteralPath $testPath
$result = Invoke-Pester -Path $testPath -Output None -PassThru
"Passed: $($result.PassedCount)"`,
        exampleOutput: 'Passed: 1',
        practice: [
          {
            title: 'Assert a value and a type',
            task: 'Write two tests for [int]"7". Assert that the value is 7 and that it has type [int]. Print the passed count.',
            expected: 'Passed: 2',
            hint: 'Put the tests in separate It blocks. Pester supports Should -Be and Should -BeOfType.',
            solution: `Import-Module -FullyQualifiedName @{ ModuleName = "Pester"; ModuleVersion = "5.0.0" }
$testPath = Join-Path $PSScriptRoot "PesterType.Tests.ps1"
@'
Describe "Integer conversion" {
    It "converts the value" { ([int]"7") | Should -Be 7 }
    It "produces an integer" { ([int]"7") | Should -BeOfType [int] }
}
'@ | Set-Content -LiteralPath $testPath
$result = Invoke-Pester -Path $testPath -Output None -PassThru
"Passed: $($result.PassedCount)"`,
          },
          {
            title: 'Test accepted and rejected input',
            review: 'Unit 4 · Conversions; this unit · Terminating errors and boundary checks',
            task: 'Use BeforeAll to define a parser that accepts whole numbers 1 or greater and throws on bad or nonpositive input. Write one test for 1 and one test that checks rejected input. Print both the passed and failed counts.',
            expected: 'Passed: 2\nFailed: 0',
            hint: 'For the error case, pipe a script block to Should -Throw. That lets Pester run the code and catch the error itself.',
            solution: `Import-Module -FullyQualifiedName @{ ModuleName = "Pester"; ModuleVersion = "5.0.0" }
$testPath = Join-Path $PSScriptRoot "PesterPositive.Tests.ps1"
@'
BeforeAll {
    function ConvertTo-PositiveNumber {
        param([string]$Text)
        $number = $Text -as [int]
        if ($null -eq $number -or $number -le 0) { throw "Expected a positive number." }
        $number
    }
}
Describe "Positive number parsing" {
    It "accepts one" { (ConvertTo-PositiveNumber "1") | Should -Be 1 }
    It "rejects zero" { { ConvertTo-PositiveNumber "0" } | Should -Throw }
}
'@ | Set-Content -LiteralPath $testPath
$result = Invoke-Pester -Path $testPath -Output None -PassThru
"Passed: $($result.PassedCount)"
"Failed: $($result.FailedCount)"`,
          },
        ],
      },
      {
        id: 'reliability-challenge', title: 'Challenge: test an input parser', time: 24, challenge: true,
        intro: 'Make the valid and invalid outcomes explicit, then verify both paths.',
        file: 'parser-tests.ps1',
        practice: [{
          title: 'Detect invalid input and test the failure',
          review: 'Unit 8 · Terminating errors and assertions. Units 4 and 7 · Conversion and functions.',
          task: 'Write ConvertTo-LabCount, which accepts text and returns an integer unless it is invalid or negative. Throw “Invalid count” for invalid input. Assert that "0" returns 0 and "3" returns 3. Test that "tea" raises the expected error. If "tea" is accepted or raises a different error, the test should fail.',
          expected: '3 checks passed.',
          hint: 'Use -as [int] and test explicitly for $null. In the invalid-input test, set an error variable in catch and assert on it outside catch, so your own assertion cannot be mistaken for the parser’s error.',
          solution: `function ConvertTo-LabCount {
    param([string]$Text)
    $value = $Text -as [int]
    if ($null -eq $value -or $value -lt 0) { throw "Invalid count" }
    $value
}
if ((ConvertTo-LabCount "0") -ne 0) { throw "Expected zero" }
if ((ConvertTo-LabCount "3") -ne 3) { throw "Expected three" }
$failure = $null
try { $null = ConvertTo-LabCount "tea" } catch { $failure = $_.Exception.Message }
if ($failure -ne "Invalid count") { throw "Expected Invalid count" }
"3 checks passed."`,
        }],
      },
    ],
  },
);
