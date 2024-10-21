#!/bin/bash

# This script is used to monitor the log files of the Meyton Shootmaster software.
# It will print the new lines of the log files to the console.
# These represent the shots that were fired per range.
# Meyton calls this feature "Schussprotokoll".

cd /var/shootmaster # Change to the directory where the log files are stored

fileStates="" # This variable will hold the state of the log files


# Get the initial line count of each log file
fileList=`find -maxdepth 1 -type f -name "log.*.txt" ! -name "log.0.txt" | sort -n` 
for file in $fileList; do # Loop through all log files
  initialLineCount=`cut -d";" -f 16 $file | cut -d"\"" -f 2 | sed /$(date +%-d.%m.%Y)/d | wc -l` # Get the line count of shots fired before today
  fileStates="$fileStates$file;$initialLineCount " # Append the file name and line count to the fileStates variable
done

while true; do # Loop forever
  
  for fileInfo in $fileStates; do # Loop through all log files
    if [ $fileInfo == "" ]; then # Discard empty entries (Last entry is always empty)
      continue 
    fi
    fileName=`echo $fileInfo | cut -d';' -f1` # Get the file name
    if [ ! -f $fileName ]; then  # If the file does not exist anymore
      continue  # Skip this file
    fi
    oldLineCount=`echo $fileInfo | cut -d';' -f2` # Get the old line count 
    lineCount=`wc -l $fileName | cut -d' ' -f1` # Get the new line count
    if [ $lineCount -gt $oldLineCount ]; then  # If the line count has changed
      tail -n `expr $lineCount - $oldLineCount` $fileName # Print the new lines
    elif [ $lineCount -lt $oldLineCount ]; then # If the log file was reset
      tail -n $lineCount $fileName # Print the new lines
    fi
  done

  # Update the file states
  tempFileStates=""
  existingFiles=`find -maxdepth 1 -type f -name "log.*.txt" ! -name "log.0.txt" | sort -n` # Get all log files
  for file in $existingFiles; do # Loop through all log files

    fileNew=`echo "$fileStates" | grep "$file"` # Check if the file is already in the fileStates variable
    if [ "$fileNew" == "" ]; then # If the file is not in the fileStates variable
      tempFileStates="$tempFileStates$file;0 " # Add the file to the fileStates variable as empty
    else # If the file is already in the fileStates variable
      lineCount=`wc -l $file | cut -d' ' -f1` # Get the line count of the file
      tempFileStates="$tempFileStates$file;$lineCount " # Add the file to the fileStates variable with the line count
    fi
  done
  fileStates=$tempFileStates # Update the fileStates variable

  echo "LOG_DATA_END" # Print the end of the data marker
  
  sleep 2
done