/**
 * Blockly Lua: ComputerCraft File System API
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
 * @fileoverview Blocks for ComputerCraft File System (FS) API.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

BlocklyLua.OS_BLOCK_COLOUR_ = 30;

BlocklyLua.OS_FUNCS_ = [
  {name: 'terminate',
   // This has a previous, but not a following, statement, which is rare.
   stmtConns: BlocklyLua.StmtConns.PREVIOUS,
   text: 'terminate with error %1',
   args: [['MSG', null]],
   tooltip:
   'End the program with the provided error message.  ' +
   'This should not be used for normal termination.'
  },
  {name: 'sleep',
   stmtConns: BlocklyLua.StmtConns.PREVIOUS | BlocklyLua.StmtConns.NEXT,
   text: 'sleep %1 seconds',
   args: [['VALUE', 'Number']],
   tooltip: 'Sleep for the specified number of seconds.'
  }
];

for (var i = 0; i < BlocklyLua.OS_FUNCS_.length; i++) {
  BlocklyLua.buildValueBlock(
    'os', BlocklyLua.OS_BLOCK_COLOUR_, BlocklyLua.OS_FUNCS_[i]);
}

// Added in order to continue to support programs with the old block name.
Blockly.Blocks['terminate'] = Blockly.Blocks['os_terminate'];
Blockly.Lua['terminate'] = Blockly.Lua['os_terminate'];
