/**
 * Blockly Lua: ComputerCraft Operating System (OS) API
 *
 * Copyright 2013 Google Inc.
 * http://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Blocks for ComputerCraft Operating System (OS) API.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.require('ComputerCraft.DependentInputBlock');
goog.require('ComputerCraft.ValueBlock');
goog.require('ComputerCraft.VarArgsBlock');

Blockly.ComputerCraft.OS_BLOCK_COLOUR_ = 30;

Blockly.ComputerCraft.OS_FUNCS_ = [
  {funcName: 'terminate',
   // This has a previous, but not a following, statement, which is rare.
   stmtConns: Blockly.ComputerCraft.StmtConns.PREVIOUS,
   text: 'terminate with error %1',
   args: [['MSG', null]],
   tooltip:
   'End the program with the provided error message.  ' +
   'This should not be used for normal termination.'
  },
  {funcName: 'sleep',
   text: 'sleep %1 seconds',
   args: [['VALUE', 'Number']],
   tooltip: 'Sleep for the specified number of seconds.'
  },
  {funcName: 'version',
   text: 'get OS version',
   output: 'String',
   tooltip: 'Get the name of the version of CraftOS being used.'},
  {funcName: 'getComputerID',
   text: 'get computer ID',
   output: 'Number',
   tooltip: 'Get the unique numeric ID of this computer.'},
  {funcName: 'getComputerLabel',
   text: 'get computer label',
   output: 'String',
   tooltip:
   'Get the label of this computer.\n' +
   'The label can be set with "set computer label".'},
  {funcName: 'setComputerLabel',
   text: 'set computer label to %1',
   args: [['LABEL', 'String']],
   tooltip:
   'Set the label of this computer.\n' +
   'The label can be read with "get computer label".'},
  {blockName: 'api',
   text: '%1 API %2',
   args: [['OPTION',
           new Blockly.FieldDropdown([['load', 'loadAPI'],
                                      ['unload', 'unloadAPI']])],
          ['NAME', 'String']],
   ddFuncName: 'OPTION',
   tooltip: 'Load or unload a Lua script as an API in its own namespace.'},
  {funcName: 'clock',
   text: 'get running time',
   output: 'Number',
   tooltip: 'Get the amount of time this computer has been running, in seconds.'},
  {funcName: 'setAlarm',
   text: 'set alarm for %1 s',
   args: [['TIME', 'Number']],
   output: 'Table',
   tooltip:
   'Queue an alarm event to occur after the specified number of seconds.\n' +
   'The ID of the alarm, which is a table, is returned.'},
  {funcName: 'time_day',
   ddFuncName: 'OPTION',
   text: 'get in-game %1',
   args: [['OPTION',
           new Blockly.FieldDropdown(
             [['time', 'time'], ['day', 'day']])]],
   output: 'Number',
   tooltip:
   'Get the current in-game time or day.\n' +
   'Time can be converted into a string with\n' +
   'the "format time" block in Text Utilities.\n' +
   'Day is the number of days since the world creation.'},
  {funcName: 'shutdown',
   text: 'shut down computer',
   tooltip: 'Turn off this computer.'},
  {funcName: 'reboot',
   text: 'reboot computer',
   tooltip: 'Reboot this computer.'},
  {funcName: 'startTimer',
   text: 'start timer for %1 s',
   args: [['TIME', 'Number']],
   output: 'Number',
   expStmt: true,
   tooltip:
   'Queue a timer event to occur after\n' +
   'the specified number of seconds.\n' +
   'The ID of the timer is returned.'}
];

Blockly.ComputerCraft.OS_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildValueBlock(
    'os', Blockly.ComputerCraft.OS_BLOCK_COLOUR_, info);});


// Added in order to continue to support programs with the old block name.
Blockly.Blocks['terminate'] = Blockly.Blocks['os_terminate'];
Blockly.Lua['terminate'] = Blockly.Lua['os_terminate'];

Blockly.ComputerCraft.buildVarArgsBlock(
  'os',
  Blockly.ComputerCraft.OS_BLOCK_COLOUR_,
  {funcName: 'queueEvent',
   text: 'queue event %1 %v',
   args: [['EVENT', 'String']],
   varArgName: 'name',
   varArgType: true,
   varArgTooltip: 'A parameter to pass to the event.',
   varArgTitle: 'with parameters',
   varArgCount: 1,
   varContainerName: 'parameters',
   varContainerTitle: 'Add, remove, or reorder parameters to pass to the event.',
   tooltip:
   'Add an event to the event queue with the given name and parameters.'});

Blockly.ComputerCraft.buildDependentInputBlock(
  'os',
  Blockly.ComputerCraft.OS_BLOCK_COLOUR_,
  {funcName: 'pullEvent',
   text: 'pull %1 %2',
   output: ['String', 'Number', 'Colour', 'Table', 'Vector', 'Function'],
   multipleOutputs: Infinity,  // Not really infinite, but unbounded.
   args: [['OPTION*',
           [['any event', 'any'],
            ['named event', 'named*'],
            ['raw event', 'raw']]],
          ['EVENT^', 'String']],
   // pullEvent is used if OPTION is 'any' or 'named';
   // pullEventRaw is used if OPTION is 'raw'.
   suppressLua: true,
   tooltip:
     'Block until the computer receives an event,\n' +
     'outputting the name of the event and its parameters.\n' +
     'The "terminate" event is only caught in raw mode.'});

Blockly.Lua['os_pull_event'] = function(block) {
  var code = block.generateLua();
  if (block.getTitleValue('OPTION') == 'raw') {
    code[0] = code[0].replace('pullEvent', 'pullEventRaw');
  }
  return code;
};

Blockly.ComputerCraft.buildVarArgsBlock(
  'os',
  Blockly.ComputerCraft.OS_BLOCK_COLOUR_,
  {funcName: 'run',
   text: 'run program %2 with environment %1 %v',
   args: [['ENV', 'Table'],
          ['PATH', 'String']],
   varArgName: 'parameter',
   varArgType: true,
   varArgTooltip: 'A parameter to pass to the program.',
   varArgTitle: 'and parameters',
   varArgCount: 1,
   varContainerName: 'parameters',
   varContainerTooltip: 'Add, remove, or reorder parameters.',
   tooltip:
   'Run the program at the specified path with the given\n' +
   'environment table.  Providing parameters is optional.\n' +
   'Parameters can be added or removed by clicking on the star.'});
