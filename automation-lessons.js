units.push(
  {
    title: 'The shell, tools, and APIs',
    goal: 'Discover commands, call programs, and bring data from a web API into a script.',
    references: [
      ['About profiles', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_profiles'],
      ['About native command parsing', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_parsing'],
      ['Invoke-RestMethod', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.utility/invoke-restmethod'],
      ['PSResourceGet quick start', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.psresourceget/'],
    ],
    lessons: [
      {
        id: 'discovery', title: 'Discover commands and read help', time: 15,
        intro: 'Find the command and parameters you need when you encounter a new task.',
        notes: [
          'Get-Command discovers installed commands. Get-Help <name> -Examples shows examples when full help is available. Use Get-Help <name> -Online for the online reference.',
          'Get-Alias explains shortcuts. Use full command names in shared scripts. Profiles are optional startup scripts, and pwsh -NoProfile helps check whether a script depends on your personal setup.',
        ],
        file: 'discovery.ps1',
        example: `$command = Get-Command Get-ChildItem -CommandType Cmdlet
$command.Source
$command.Parameters.ContainsKey("LiteralPath")`,
        exampleOutput: 'Microsoft.PowerShell.Management\nTrue',
        practice: [
          {
            title: 'Find the full name of an alias',
            task: 'Use Get-Alias to find the command behind gci. Print its Definition property. Then look up Get-ChildItem examples with Get-Help.',
            expected: 'Get-ChildItem',
            expectedLabel: 'Alias lookup output',
            hint: 'Put Get-Alias gci in parentheses and read .Definition.',
            solution: '(Get-Alias gci).Definition',
          },
          {
            title: 'Check parameter support before choosing a command',
            review: 'Unit 4 · Keys; Unit 5 · Command objects',
            task: 'Inspect Get-Content and Get-ChildItem. For each one, report whether its parameter map contains Raw.',
            expected: 'Get-Content supports Raw: True\nGet-ChildItem supports Raw: False',
            hint: 'Loop over command names, then use (Get-Command $name).Parameters.ContainsKey("Raw").',
            solution: `foreach ($name in @("Get-Content", "Get-ChildItem")) {
    $supportsRaw = (Get-Command $name).Parameters.ContainsKey("Raw")
    "$name supports Raw: $supportsRaw"
}`,
          },
        ],
      },
      {
        id: 'native-programs', title: 'Run native programs and read exit codes', time: 16,
        intro: 'Pass arguments safely and detect failures from external programs.',
        notes: [
          'The call operator & invokes a command stored in a variable. Array splatting passes each item as a separate argument. Keep each argument in its own array slot, even when it contains spaces.',
          '$LASTEXITCODE is the exit code of the most recent native program. Capture it right after the call. $env:Name reads or changes an environment variable for this process and its children.',
        ],
        file: 'native-programs.ps1',
        example: `$shellPath = (Get-Process -Id $PID).Path
$arguments = @("-NoProfile", "-Command", "exit 3")
& $shellPath @arguments
$status = $LASTEXITCODE
"Exit code: $status"`,
        exampleOutput: 'Exit code: 3',
        practice: [
          {
            title: 'Capture a program’s exit code',
            task: 'Use the current PowerShell executable to run a child process that exits with status 7. Print the captured exit code.',
            expected: 'Exit code: 7',
            hint: 'Keep the -Command value as one array item. Read $LASTEXITCODE after & runs.',
            solution: `$shellPath = (Get-Process -Id $PID).Path
$arguments = @("-NoProfile", "-Command", "exit 7")
& $shellPath @arguments
$status = $LASTEXITCODE
"Exit code: $status"`,
          },
          {
            title: 'Give a child process a setting',
            review: 'Unit 1 · Quoting; Unit 2 · Conditions',
            task: 'Set PS_COURSE_MODE to “practice mode” and run a child PowerShell process that prints it. Check the exit code and print “Child succeeded” only for code 0.',
            expected: 'practice mode\nChild succeeded',
            hint: 'Use single quotes around the child command so the child expands $env:PS_COURSE_MODE.',
            solution: `$env:PS_COURSE_MODE = "practice mode"
$shellPath = (Get-Process -Id $PID).Path
$arguments = @("-NoProfile", "-Command", 'Write-Output $env:PS_COURSE_MODE')
& $shellPath @arguments
$status = $LASTEXITCODE
if ($status -eq 0) { "Child succeeded" }`,
          },
        ],
      },
      {
        id: 'web-apis', title: 'Read a web API response', time: 18,
        intro: 'Request JSON, inspect the response object, and define what happens if the request fails.',
        requirements: 'The worked example and first exercise need internet access to the public GitHub API. The second exercise uses an offline sample response.',
        notes: [
          'Invoke-RestMethod makes HTTP requests and usually deserializes a JSON response into PowerShell objects. Use a short timeout and handle errors explicitly.',
          'Read the API documentation for fields, authentication, rate limits, and pagination. Store needed credentials outside the script. The requests here use public read-only metadata.',
        ],
        file: 'web-api.ps1',
        example: `$repository = Invoke-RestMethod -Uri "https://api.github.com/repos/PowerShell/PowerShell" -TimeoutSec 15
$repository.full_name`,
        exampleOutput: 'PowerShell/PowerShell',
        practice: [
          {
            title: 'Select stable fields from a response',
            task: 'Get the same repository metadata, then print the repository name and the login of its owner on separate lines.',
            expected: 'PowerShell\nPowerShell',
            hint: 'Read .name and then .owner.login from the returned object.',
            solution: `$repository = Invoke-RestMethod -Uri "https://api.github.com/repos/PowerShell/PowerShell" -TimeoutSec 15
$repository.name
$repository.owner.login`,
          },
          {
            title: 'Develop a report with sample JSON',
            review: 'Unit 5 · Filtering and sorting; Unit 6 · JSON',
            task: 'Treat the JSON below as an example API response. Filter archived repositories out, sort the rest by name, and print their names. This lets you verify the data transformation without a network request.',
            expected: 'docs\nscripts',
            hint: 'Parse with ConvertFrom-Json, then use Where-Object { -not $_.archived }.',
            solution: `$response = '[{"name":"scripts","archived":false},{"name":"demo","archived":true},{"name":"docs","archived":false}]'
$data = $response | ConvertFrom-Json
$data | Where-Object { -not $_.archived } |
    Sort-Object name | Select-Object -ExpandProperty name`,
          },
        ],
      },
      {
        id: 'api-challenge', title: 'Challenge: an offline-first API report', time: 25, challenge: true,
        intro: 'Build a repeatable report from a saved response and make live requests optional.',
        file: 'api-report.ps1',
        practice: [{
          title: 'Read a local sample with an optional live request',
          review: 'Unit 9 · API responses. Units 6–8 · JSON, switches, and errors.',
          task: 'Write a script with a -Live switch. By default parse the sample {"full_name":"Example/Docs","archived":false}. With -Live, request the public PowerShell repository instead. Print its full name and archived flag. If the live request fails, report the failure and keep the sample so the report still runs. Test the default path first.',
          expected: 'Example/Docs archived: False',
          expectedLabel: 'Offline output',
          hint: 'Set $repository from sample JSON first. Replace it with Invoke-RestMethod inside try only when $Live is set. Use Write-Warning in catch so the report stays on the success stream.',
          solution: `param([switch]$Live)

$repository = '{"full_name":"Example/Docs","archived":false}' | ConvertFrom-Json
if ($Live) {
    try {
        $repository = Invoke-RestMethod -Uri "https://api.github.com/repos/PowerShell/PowerShell" -TimeoutSec 15 -ErrorAction Stop
    } catch {
        Write-Warning "Live request failed; using sample data."
    }
}
"$($repository.full_name) archived: $($repository.archived)"`,
        }],
      },
    ],
  },
  {
    title: 'Jobs, parallel work, and remoting',
    goal: 'Choose where work runs, pass values explicitly, and collect results.',
    references: [
      ['About jobs', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/about/about_jobs'],
      ['ForEach-Object and parallel execution', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.core/foreach-object'],
      ['PowerShell remoting over SSH', 'https://learn.microsoft.com/powershell/scripting/security/remoting/ssh-remoting-in-powershell'],
    ],
    lessons: [
      {
        id: 'jobs', title: 'Start and collect background jobs', time: 17,
        intro: 'Run work in a separate process and retrieve the output when it is ready.',
        notes: [
          'Start-Job returns a job object quickly. Receive-Job -Wait waits and retrieves output. Use Get-Job for status and Remove-Job to clean up finished jobs.',
          'The job runs in its own process. Pass inputs with -ArgumentList and a param block. In-process thread jobs share the parent process and have different isolation and data-copy behavior.',
        ],
        file: 'jobs.ps1',
        example: `$job = Start-Job -ScriptBlock { param($number) $number * 2 } -ArgumentList 6
try {
    Receive-Job -Job $job -Wait
} finally {
    Remove-Job -Job $job -Force
}`,
        exampleOutput: '12',
        practice: [
          {
            title: 'Pass two arguments to a job',
            task: 'Start one job that receives 3 and 4 as arguments and returns their sum. Receive the output and clean up the job.',
            expected: '7',
            hint: 'List arguments after -ArgumentList and declare them in the same order in param.',
            solution: `$job = Start-Job -ScriptBlock { param($a, $b) $a + $b } -ArgumentList 3, 4
try {
    Receive-Job -Job $job -Wait
} finally {
    Remove-Job -Job $job -Force
}`,
          },
          {
            title: 'Collect two independent results',
            review: 'Unit 2 · Loops; Unit 8 · Cleanup',
            task: 'Start a job for each value in 2, 4. Each job squares its number. Wait and receive the results, printing them in the order the jobs were submitted. Clean up only those jobs.',
            expected: '4\n16',
            hint: 'Collect the job objects from a foreach loop. Receive one job at a time in that same order.',
            solution: `$jobs = foreach ($number in @(2, 4)) {
    Start-Job -ScriptBlock { param($value) $value * $value } -ArgumentList $number
}
try {
    foreach ($job in $jobs) { Receive-Job -Job $job -Wait }
} finally {
    $jobs | Remove-Job -Force
}`,
          },
        ],
      },
      {
        id: 'parallel', title: 'Limit parallel work', time: 18,
        intro: 'Run independent operations concurrently and put the results back in order.',
        requirements: 'Use PowerShell 7 or later for ForEach-Object -Parallel.',
        notes: [
          'ForEach-Object -Parallel runs script blocks in separate runspaces. -ThrottleLimit bounds how many run at once. $_ still represents the current item, and $using: captures a value from the calling scope.',
          'Completion order can change. Return objects and sort afterward when order matters. Avoid mutating shared state, and measure before using parallelism for small tasks.',
        ],
        file: 'parallel.ps1',
        example: `$factor = 3
@(4, 2) | ForEach-Object -Parallel {
    $_ * $using:factor
} -ThrottleLimit 2 | Sort-Object`,
        exampleOutput: '6\n12',
        practice: [
          {
            title: 'Square several values in parallel',
            task: 'Use at most two workers to square 4, 1, and 3. Sort the output.',
            expected: '1\n9\n16',
            hint: 'Calculate $_ * $_ in the parallel block and sort after it.',
            solution: `@(4, 1, 3) | ForEach-Object -Parallel { $_ * $_ } -ThrottleLimit 2 |
    Sort-Object`,
          },
          {
            title: 'Return structured worker results',
            review: 'Unit 4 · Hashtables; Unit 5 · Objects and sorting',
            task: 'Set a factor of 5 in the main script. Have parallel workers return Input and Total objects for 3, 1, and 2. Sort by Input and print the totals.',
            expected: '5\n10\n15',
            hint: 'Use $using:factor inside the block. Define the properties with [pscustomobject] and extract Total after sorting.',
            solution: `$factor = 5
@(3, 1, 2) | ForEach-Object -Parallel {
    [pscustomobject]@{ Input = $_; Total = $_ * $using:factor }
} -ThrottleLimit 2 | Sort-Object Input | Select-Object -ExpandProperty Total`,
          },
        ],
      },
      {
        id: 'script-blocks-remoting', title: 'Script blocks and remoting sessions', time: 18,
        intro: 'Write a self-contained block that can be tested locally and run in an authorized session.',
        notes: [
          'A script block is code surrounded by braces. Invoke-Command -ScriptBlock runs locally when you omit a remote target. -ArgumentList supplies the block’s parameters.',
          'For a machine you administer, create a PSSession over the configured SSH or Windows WSMan transport, pass it to Invoke-Command -Session, and remove it when finished. A remote block runs in a different session. Returned objects are generally deserialized snapshots, so do method calls where the live objects exist.',
        ],
        file: 'session-block.ps1',
        example: `$report = {
    param([string]$Label)
    [pscustomobject]@{ Label = $Label; Engine = "PowerShell" }
}
$result = Invoke-Command -ScriptBlock $report -ArgumentList "lab"
"$($result.Label): $($result.Engine)"`,
        exampleOutput: 'lab: PowerShell',
        practice: [
          {
            title: 'Pass a value to an independent block',
            task: 'Create a block with a parameter called Label. Invoke it locally with “demo” and return “Check: demo”.',
            expected: 'Check: demo',
            hint: 'Use param([string]$Label) as the first line in the block.',
            solution: `$block = { param([string]$Label) "Check: $Label" }
Invoke-Command -ScriptBlock $block -ArgumentList "demo"`,
          },
          {
            title: 'Keep the data collection inside the block',
            review: 'Unit 5 · Object properties; Unit 7 · Parameters',
            task: 'Make a local block that reports the supplied Label and whether its PowerShell engine has a positive major version. Call it twice with dev and test. Include all calculation inside the block so it could run inside an already configured session.',
            expected: 'dev: True\ntest: True',
            hint: 'Inside the block read $PSVersionTable.PSVersion.Major and return an object. In the caller format Label and EngineReady.',
            solution: `$report = {
    param([string]$Label)
    [pscustomobject]@{ Label = $Label; EngineReady = $PSVersionTable.PSVersion.Major -gt 0 }
}
foreach ($label in @("dev", "test")) {
    $result = Invoke-Command -ScriptBlock $report -ArgumentList $label
    "$($result.Label): $($result.EngineReady)"
}`,
          },
        ],
      },
      {
        id: 'parallel-challenge', title: 'Challenge: parallel file summaries', time: 25, challenge: true,
        intro: 'Process independent files concurrently and return a reproducible summary.',
        requirements: 'Use PowerShell 7 or later.',
        file: 'parallel-summary.ps1',
        practice: [{
          title: 'Summarize local files with bounded workers',
          review: 'Unit 10 · Parallel work. Units 5–6 · Object pipelines and file paths.',
          task: 'Create two sample files beside the script, with 2 lines in parallel-a.txt and 3 in parallel-b.txt. Feed both paths to workers, with a throttle of 2. Return the file name and line count as objects. Sort and print by name. Reorder the input paths and check the report remains in name order.',
          expected: 'parallel-a.txt: 2\nparallel-b.txt: 3',
          hint: 'Count lines with @(Get-Content -LiteralPath $_).Count inside each block. Read the leaf name with Split-Path -Leaf.',
          solution: `$first = Join-Path $PSScriptRoot "parallel-a.txt"
$second = Join-Path $PSScriptRoot "parallel-b.txt"
Set-Content -LiteralPath $first -Value @("one", "two")
Set-Content -LiteralPath $second -Value @("one", "two", "three")
@($second, $first) | ForEach-Object -Parallel {
    [pscustomobject]@{
        Name = Split-Path -Path $_ -Leaf
        Lines = @(Get-Content -LiteralPath $_).Count
    }
} -ThrottleLimit 2 | Sort-Object Name |
    ForEach-Object { "$($_.Name): $($_.Lines)" }`,
        }],
      },
    ],
  },
);

units.push(
  {
    title: 'System administration',
    goal: 'Inspect processes, services, system information, and logs before making changes.',
    references: [
      ['Managing processes with PowerShell', 'https://learn.microsoft.com/powershell/scripting/samples/managing-processes-with-process-cmdlets'],
      ['Get-CimInstance', 'https://learn.microsoft.com/powershell/module/cimcmdlets/get-ciminstance'],
      ['Get-Service', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.management/get-service'],
      ['Get-WinEvent', 'https://learn.microsoft.com/powershell/module/microsoft.powershell.diagnostics/get-winevent'],
    ],
    lessons: [
      {
        id: 'processes', title: 'Inspect processes and the current engine', time: 17,
        intro: 'Identify the exact process you want and report stable facts about it.',
        notes: [
          'Get-Process returns process objects. Look up a specific process with -Id and inspect available properties with Get-Member. Process names can be shared by several processes.',
          '$PID identifies the current PowerShell process and $PSVersionTable describes the engine. Process state can change between enumeration and lookup, so handle errors when searching for other processes.',
        ],
        file: 'processes.ps1',
        example: `$current = Get-Process -Id $PID
"Found current process: $($current.Id -eq $PID)"`,
        exampleOutput: 'Found current process: True',
        practice: [
          {
            title: 'Verify the process you found',
            task: 'Find the current process and print whether its ProcessName has a value and whether its Id equals $PID.',
            expected: 'Has a name: True\nID matches: True',
            hint: 'Use -not [string]::IsNullOrEmpty($current.ProcessName) and compare .Id to $PID.',
            solution: `$current = Get-Process -Id $PID
"Has a name: $(-not [string]::IsNullOrEmpty($current.ProcessName))"
"ID matches: $($current.Id -eq $PID)"`,
          },
          {
            title: 'Separate system facts from their presentation',
            review: 'Unit 5 · Custom objects; Unit 7 · Functions',
            task: 'Write Get-LabEngineInfo to return an object containing the current process ID and engine major version. In the caller check both values against PowerShell’s own variables and print the results.',
            expected: 'Process matches: True\nVersion matches: True',
            hint: 'Use (Get-Process -Id $PID).Id and $PSVersionTable.PSVersion.Major in the function and compare in the caller.',
            solution: `function Get-LabEngineInfo {
    [pscustomobject]@{
        ProcessId = (Get-Process -Id $PID).Id
        EngineMajor = $PSVersionTable.PSVersion.Major
    }
}
$info = Get-LabEngineInfo
"Process matches: $($info.ProcessId -eq $PID)"
"Version matches: $($info.EngineMajor -eq $PSVersionTable.PSVersion.Major)"`,
          },
        ],
      },
      {
        id: 'services-cim', title: 'Inspect Windows services and CIM data', time: 19,
        intro: 'Practice system inventory queries and handle platform differences.',
        requirements: 'PowerShell 7 is required for the platform check. Live service and CIM queries in this lesson require Windows. Exercises use sample records on any platform.',
        notes: [
          'On Windows, Get-Service lists service names and status. Get-CimInstance -ClassName Win32_OperatingSystem returns operating system data. Use a class or property filter to keep the query focused.',
          'Guard Windows-only commands with $IsWindows in PowerShell 7 and design reports to accept sample data. Inspect on a machine you administer using the minimum permissions the query requires.',
        ],
        file: 'services-cim.ps1',
        example: `if ($IsWindows) {
    $system = Get-CimInstance -ClassName Win32_OperatingSystem -Property Caption -ErrorAction Stop
    "OS caption available: $(-not [string]::IsNullOrEmpty($system.Caption))"
} else {
    "CIM example requires Windows."
}`,
        exampleOutput: 'OS caption available: True',
        exampleOutputLabel: 'Expected output on Windows',
        practice: [
          {
            title: 'Find a stopped service in sample data',
            task: 'Use service-shaped objects with Name and Status. Create one Running service and one Stopped service. Print only the stopped service name.',
            expected: 'LabQueue',
            hint: 'Use Where-Object { $_.Status -eq "Stopped" } before selecting Name.',
            solution: `$services = @(
    [pscustomobject]@{ Name = "LabWeb"; Status = "Running" }
    [pscustomobject]@{ Name = "LabQueue"; Status = "Stopped" }
)
$services | Where-Object { $_.Status -eq "Stopped" } |
    Select-Object -ExpandProperty Name`,
          },
          {
            title: 'Build a service summary with a sample mode',
            review: 'Unit 7 · Switch parameters; Unit 5 · Filtering and sorting',
            task: 'By default return sample services LabWeb (Running), LabQueue (Stopped), and LabSync (Stopped). Add -Live to read Get-Service data on Windows. Print only the stopped names in sorted order. For -Live on other platforms, print an explanatory error.',
            expected: 'LabQueue\nLabSync',
            expectedLabel: 'Default sample output',
            hint: 'Choose the data source first, then keep one shared reporting pipeline.',
            solution: `param([switch]$Live)

if ($Live) {
    if (-not $IsWindows) { throw "Live service inventory requires Windows." }
    $services = Get-Service
} else {
    $services = @(
        [pscustomobject]@{ Name = "LabWeb"; Status = "Running" }
        [pscustomobject]@{ Name = "LabQueue"; Status = "Stopped" }
        [pscustomobject]@{ Name = "LabSync"; Status = "Stopped" }
    )
}
$services | Where-Object { $_.Status -eq "Stopped" } |
    Sort-Object Name | Select-Object -ExpandProperty Name`,
          },
        ],
      },
      {
        id: 'logs', title: 'Query and summarize logs', time: 17,
        intro: 'Filter for the events you need and report counts without depending on terminal formatting.',
        notes: [
          'On Windows, use Get-WinEvent -FilterHashtable with keys such as LogName, Level, and StartTime. Filtering at the source is usually faster than piping a whole log through Where-Object.',
          'Other platforms expose logs through different tooling. Use sample event objects to develop the summarization logic independently of where the events came from.',
        ],
        file: 'event-summary.ps1',
        example: `$events = @(
    [pscustomobject]@{ Id = 40; Level = 2 }
    [pscustomobject]@{ Id = 50; Level = 4 }
)
$events | Where-Object { $_.Level -eq 2 } | Select-Object -ExpandProperty Id`,
        exampleOutput: '40',
        practice: [
          {
            title: 'Count error events',
            task: 'Create event rows for IDs 40, 50, and 40 at levels 2, 4, and 2. Count only events with level 2.',
            expected: 'Errors: 2',
            hint: 'Run the filter first and wrap its results in @() to get a reliable count.',
            solution: `$events = @(
    [pscustomobject]@{ Id = 40; Level = 2 }
    [pscustomobject]@{ Id = 50; Level = 4 }
    [pscustomobject]@{ Id = 40; Level = 2 }
)
$errors = @($events | Where-Object { $_.Level -eq 2 })
"Errors: $($errors.Count)"`,
          },
          {
            title: 'Group recent errors by ID',
            review: 'Unit 5 · Grouping; Unit 4 · Types; Unit 2 · Conditions',
            task: 'Make errors with IDs 40 and 41 on January 2, and one more error with ID 40 on January 1. Keep entries on or after January 2, then print the count for each ID.',
            expected: '40: 1\n41: 1',
            hint: 'Use [datetime]"2026-01-02" for the fixed cutoff and [datetime] values in the rows. Group-Object Id produces one group per ID.',
            solution: `$cutoff = [datetime]"2026-01-02"
$events = @(
    [pscustomobject]@{ Id = 40; TimeCreated = [datetime]"2026-01-02" }
    [pscustomobject]@{ Id = 41; TimeCreated = [datetime]"2026-01-02" }
    [pscustomobject]@{ Id = 40; TimeCreated = [datetime]"2026-01-01" }
)
$events | Where-Object { $_.TimeCreated -ge $cutoff } |
    Group-Object Id | Sort-Object Name |
    ForEach-Object { "$($_.Name): $($_.Count)" }`,
          },
        ],
      },
      {
        id: 'inventory-report', title: 'Challenge: service health report', time: 24, challenge: true,
        intro: 'Turn service inventory into a scriptable health report.',
        file: 'service-health.ps1',
        practice: [{
          title: 'Check expected service states and export exceptions',
          review: 'Unit 11 · Service inventory. Units 4–6 · Keys, objects, and CSV.',
          task: 'Make an expected-services hashtable for LabWeb and LabQueue. Feed the script inventory rows for LabWeb (Running), LabQueue (Stopped), and LabExtra (Stopped). List only expected services that are stopped or absent. Export each exception with Name and State to service-health.csv, then read it back. Test again with LabQueue removed from the inventory.',
          expected: 'LabQueue: Stopped\n\nLabQueue: Missing',
          expectedLabel: 'Original sample, then sample without LabQueue',
          hint: 'Build a lookup by actual service name. For each expected name, test ContainsKey first so a missing service can get its own state.',
          solution: `$expected = @{ LabWeb = "Running"; LabQueue = "Running" }
$services = @(
    [pscustomobject]@{ Name = "LabWeb"; Status = "Running" }
    [pscustomobject]@{ Name = "LabQueue"; Status = "Stopped" }
    [pscustomobject]@{ Name = "LabExtra"; Status = "Stopped" }
)
$actual = @{}
foreach ($service in $services) { $actual[$service.Name] = $service.Status }
$exceptions = foreach ($name in ($expected.Keys | Sort-Object)) {
    if (-not $actual.ContainsKey($name)) {
        [pscustomobject]@{ Name = $name; State = "Missing" }
    } elseif ($actual[$name] -ne $expected[$name]) {
        [pscustomobject]@{ Name = $name; State = $actual[$name] }
    }
}
$path = Join-Path $PSScriptRoot "service-health.csv"
$exceptions | Export-Csv -LiteralPath $path -NoTypeInformation
Import-Csv -LiteralPath $path | ForEach-Object { "$($_.Name): $($_.State)" }`,
        }],
      },
    ],
  },
  {
    title: 'Safe, repeatable automation',
    goal: 'Preview changes, keep secrets out of output, and run scripts unattended with clear success and failure signals.',
    references: [
      ['The ShouldProcess pattern', 'https://learn.microsoft.com/powershell/scripting/learn/deep-dives/everything-about-shouldprocess'],
      ['PowerShell SecretManagement overview', 'https://learn.microsoft.com/powershell/utility-modules/secretmanagement/overview'],
      ['ScheduledTasks module for Windows', 'https://learn.microsoft.com/powershell/module/scheduledtasks/'],
      ['PowerShell documentation and platform guides', 'https://learn.microsoft.com/powershell/'],
    ],
    lessons: [
      {
        id: 'whatif', title: 'Preview changes and make reruns predictable', time: 19,
        intro: 'Separate the decision about whether to change something from the change itself.',
        notes: [
          'An idempotent script leaves the desired state unchanged on another run. Compare what exists with what you want before writing.',
          '[CmdletBinding(SupportsShouldProcess)] adds -WhatIf and -Confirm. Put the actual side effect inside an if ($PSCmdlet.ShouldProcess(...)) block. A preview is only useful if all side effects respect it.',
        ],
        file: 'whatif.ps1',
        example: `function Set-LabNote {
    [CmdletBinding(SupportsShouldProcess)]
    param([string]$Path)
    if ($PSCmdlet.ShouldProcess($Path, "Write the lab note")) {
        Set-Content -LiteralPath $Path -Value "Ready"
    }
}
$path = Join-Path $PSScriptRoot "change-preview-lab.txt"
Set-LabNote -Path $path -WhatIf`,
        exampleOutput: 'What if: Performing the operation "Write the lab note" on target ".../change-preview-lab.txt".',
        exampleOutputLabel: 'Example preview (your file path will differ)',
        practice: [
          {
            title: 'Prove a preview writes no file',
            task: 'Add a check around the example. Use a fresh filename and print whether it exists before and after the -WhatIf call. Leave any existing files alone.',
            expected: 'Before: False\nAfter: False',
            expectedLabel: 'Boolean checks, with a preview message between them',
            hint: 'You can generate a unique demo name with [guid]::NewGuid(). Use Test-Path before and after.',
            solution: `function Set-LabNote {
    [CmdletBinding(SupportsShouldProcess)]
    param([string]$Path)
    if ($PSCmdlet.ShouldProcess($Path, "Write the lab note")) {
        Set-Content -LiteralPath $Path -Value "Ready"
    }
}
$path = Join-Path $PSScriptRoot "preview-$([guid]::NewGuid()).txt"
"Before: $(Test-Path -LiteralPath $path)"
Set-LabNote -Path $path -WhatIf
"After: $(Test-Path -LiteralPath $path)"`,
          },
          {
            title: 'Skip a write when content already matches',
            review: 'Unit 6 · Paths and files; Unit 7 · Advanced functions',
            task: 'Create a function that writes “Ready” to a fresh demo file when needed, and prints “Already current” if the file already holds exactly that line. Call it twice and keep SupportsShouldProcess around the write.',
            expected: 'Updated\nAlready current',
            hint: 'Use Test-Path first. Compare the file contents with the desired value before calling ShouldProcess.',
            solution: `function Set-LabNote {
    [CmdletBinding(SupportsShouldProcess)]
    param([string]$Path)
    if ((Test-Path -LiteralPath $Path -PathType Leaf) -and
        ((Get-Content -LiteralPath $Path -Raw).TrimEnd() -ceq "Ready")) {
        "Already current"
        return
    }
    if ($PSCmdlet.ShouldProcess($Path, "Write the lab note")) {
        Set-Content -LiteralPath $Path -Value "Ready"
        "Updated"
    }
}
$path = Join-Path $PSScriptRoot "rerun-$([guid]::NewGuid()).txt"
Set-LabNote -Path $path
Set-LabNote -Path $path`,
          },
        ],
      },
      {
        id: 'secrets', title: 'Separate configuration and secrets', time: 17,
        intro: 'Read settings at runtime and verify required credentials without displaying them.',
        notes: [
          'Keep secrets out of code, version history, logs, and command-line arguments. In production, use an approved vault or SecretManagement extension and grant the automation identity only the access it needs.',
          'Exercises use fake process-local values. Real environment variables can be inherited by child processes. For scheduled runs, verify how that account receives its configuration and secret access.',
        ],
        file: 'settings-check.ps1',
        example: `$env:PS_COURSE_FAKE_TOKEN = "practice-only"
try {
    $available = -not [string]::IsNullOrWhiteSpace($env:PS_COURSE_FAKE_TOKEN)
    "Test credential configured: $available"
} finally {
    Remove-Item Env:PS_COURSE_FAKE_TOKEN -ErrorAction SilentlyContinue
}`,
        exampleOutput: 'Test credential configured: True',
        practice: [
          {
            title: 'Detect a missing setting',
            task: 'Use a variable that represents a missing credential. Print “Configuration missing” without including its value in the message.',
            expected: 'Configuration missing',
            hint: 'Set the variable to $null, then use [string]::IsNullOrWhiteSpace in an if block.',
            solution: `$credential = $null
if ([string]::IsNullOrWhiteSpace($credential)) { "Configuration missing" }`,
          },
          {
            title: 'Validate settings before starting work',
            review: 'Unit 4 · Hashtables; Unit 8 · Errors and tests',
            task: 'Write Test-LabSettings to check fake settings for Endpoint and Token. It should return True for a complete sample. For a missing token, throw “Missing setting: Token”. Run both cases and print only the result and error message.',
            expected: 'True\nMissing setting: Token',
            hint: 'Loop over the expected keys. Test each value with IsNullOrWhiteSpace and put only the key name in the error.',
            solution: `function Test-LabSettings {
    param([hashtable]$Settings)
    foreach ($key in @("Endpoint", "Token")) {
        if ([string]::IsNullOrWhiteSpace($Settings[$key])) {
            throw "Missing setting: $key"
        }
    }
    $true
}
Test-LabSettings @{ Endpoint = "example.invalid"; Token = "fake-value" }
try {
    Test-LabSettings @{ Endpoint = "example.invalid" }
} catch {
    $_.Exception.Message
}`,
          },
        ],
      },
      {
        id: 'scheduled-scripts', title: 'Prepare a script for unattended runs', time: 18,
        intro: 'Make the entry point predictable when a scheduler or CI job launches it.',
        notes: [
          'Run scripts with pwsh -NoProfile -NonInteractive -File followed by an absolute path. Use script parameters instead of prompts, and use $PSScriptRoot for bundled files because the scheduler can start in a different folder.',
          'Return exit 0 for success and a nonzero code for failure. Test the exact command under the intended account before using Task Scheduler, cron, a systemd timer, or CI. Review where output goes and how the job reports failures.',
        ],
        file: 'unattended.ps1',
        example: `param([string]$Mode = "report")

if ($Mode -ne "report") {
    [Console]::Error.WriteLine("Unknown mode.")
    exit 2
}
"Report mode is ready."
exit 0`,
        exampleOutput: 'Report mode is ready.',
        practice: [
          {
            title: 'Make success explicit',
            task: 'Write a script with a Label parameter that defaults to “daily”. Print “Run: daily” with the default, then exit with code 0.',
            expected: 'Run: daily',
            hint: 'Put param([string]$Label = "daily") at the top. Use exit 0 after printing.',
            solution: `param([string]$Label = "daily")
"Run: $Label"
exit 0`,
          },
          {
            title: 'Test failure from a separate process',
            review: 'Unit 9 · Native commands and exit codes; Unit 6 · Portable paths',
            task: 'Write a demo child script that accepts only the label “daily”. Run it through the current PowerShell executable with -NoProfile -NonInteractive -File and label “unknown”. Capture the exit code, then rerun with daily. The child should use code 2 for a rejected value.',
            expected: 'Unknown exit: 2\nDaily exit: 0',
            hint: 'Use a single-quoted here-string for the child script and read $LASTEXITCODE immediately after each invocation.',
            solution: `$path = Join-Path $PSScriptRoot "unattended-child.ps1"
@'
param([string]$Label)
if ($Label -ne "daily") { exit 2 }
exit 0
'@ | Set-Content -LiteralPath $path
$engine = (Get-Process -Id $PID).Path
& $engine -NoProfile -NonInteractive -File $path -Label "unknown"
"Unknown exit: $LASTEXITCODE"
& $engine -NoProfile -NonInteractive -File $path -Label "daily"
"Daily exit: $LASTEXITCODE"`,
          },
        ],
      },
      {
        id: 'automation-capstone', title: 'Capstone: unattended inventory report', time: 40, challenge: true,
        intro: 'Build a command that checks input, creates a reproducible report, supports preview, and can run on a schedule.',
        file: 'inventory-capstone.ps1',
        practice: [{
          title: 'Build and test the report command',
          review: 'Unit 12 · Preview and safe reruns. Units 5–8 · Objects, CSV, parameters, errors, and tests.',
          task: 'Write a function with a validated Threshold, a destination Path, and -WhatIf. For Cable at 2, Adapter at 1, and Plug at 10, export rows at or below the threshold in ascending quantity order to a CSV with Item and Quantity. Compare the generated CSV with any existing report before writing it. Test preview first, then a real run at threshold 2, a repeat with no change, and a final run at threshold 1. Verify file existence and imported contents with assertions. Add Threshold and Destination script parameters for unattended runs, plus a Preview switch, and use a demo filename when running your checks.',
          expected: 'Preview wrote no file.\nUpdated\nAlready current\nAdapter: 1\nCable: 2\nUpdated\nNarrow report: Adapter',
          expectedLabel: 'Output apart from the preview message (which includes the local path)',
          hint: 'Build ordered rows with a pipeline. ConvertTo-Csv lets you compare lines before writing and handle an empty report with a header. Set -ErrorAction Stop on file operations that must succeed. Call your function from a script that can be launched without prompts.',
          solution: `param(
    [int]$Threshold = 2,
    [string]$Destination,
    [switch]$Preview
)

function Write-LabInventoryReport {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [Parameter(Mandatory)][ValidateRange(0, 1000)][int]$Threshold,
        [Parameter(Mandatory)][string]$Path
    )
    $catalog = @(
        [pscustomobject]@{ Item = "Cable"; Quantity = 2 }
        [pscustomobject]@{ Item = "Adapter"; Quantity = 1 }
        [pscustomobject]@{ Item = "Plug"; Quantity = 10 }
    )
    $rows = @($catalog | Where-Object { $_.Quantity -le $Threshold } | Sort-Object Quantity)
    $lines = if ($rows.Count -gt 0) {
        $rows | ConvertTo-Csv -NoTypeInformation
    } else {
        '"Item","Quantity"'
    }
    if (Test-Path -LiteralPath $Path -PathType Leaf) {
        $existing = Get-Content -LiteralPath $Path -ErrorAction Stop
        if (($existing -join [Environment]::NewLine) -ceq ($lines -join [Environment]::NewLine)) {
            "Already current"
            return
        }
    }
    if ($PSCmdlet.ShouldProcess($Path, "Write inventory report")) {
        Set-Content -LiteralPath $Path -Value $lines -ErrorAction Stop
        "Updated"
    }
}

if ($Destination) {
    try {
        Write-LabInventoryReport -Threshold $Threshold -Path $Destination -WhatIf:$Preview -ErrorAction Stop
    } catch {
        [Console]::Error.WriteLine($_.Exception.Message)
        exit 1
    }
    exit 0
}

$path = Join-Path $PSScriptRoot "capstone-$([guid]::NewGuid()).csv"
Write-LabInventoryReport -Threshold 2 -Path $path -WhatIf
if (Test-Path -LiteralPath $path) { throw "Preview changed the filesystem" }
"Preview wrote no file."
Write-LabInventoryReport -Threshold 2 -Path $path
Write-LabInventoryReport -Threshold 2 -Path $path
$rows = @(Import-Csv -LiteralPath $path)
$actual = ($rows | ForEach-Object { "$($_.Item): $($_.Quantity)" }) -join ","
if ($actual -ne "Adapter: 1,Cable: 2") { throw "Unexpected report rows" }
$rows | ForEach-Object { "$($_.Item): $($_.Quantity)" }
Write-LabInventoryReport -Threshold 1 -Path $path
$narrow = @(Import-Csv -LiteralPath $path)
if ($narrow.Count -ne 1 -or $narrow[0].Item -ne "Adapter") { throw "Unexpected narrow report" }
"Narrow report: $($narrow[0].Item)"`,
        }],
      },
    ],
  },
);
