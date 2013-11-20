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
   stmtConns: Blockly.ComputerCraft.StmtConns.PREVIOUS |
   Blockly.ComputerCraft.StmtConns.NEXT,
   text: 'sleep %1 seconds',
   args: [['VALUE', 'Number']],
   tooltip: 'Sleep for the specified number of seconds.'
  }
];

for (var i = 0; i < Blockly.ComputerCraft.OS_FUNCS_.length; i++) {
  Blockly.ComputerCraft.buildValueBlock(
    'os',
    Blockly.ComputerCraft.OS_BLOCK_COLOUR_,
    Blockly.ComputerCraft.OS_FUNCS_[i]);
}

// Added in order to continue to support programs with the old block name.
Blockly.Blocks['terminate'] = Blockly.Blocks['os_terminate'];
Blockly.Lua['terminate'] = Blockly.Lua['os_terminate'];
