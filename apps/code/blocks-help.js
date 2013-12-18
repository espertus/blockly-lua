/**
 * Blockly Lua: ComputerCraft Help API
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
 * @fileoverview Blocks for ComputerCraft Help API
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.require('ComputerCraft.ValueBlock');

Blockly.ComputerCraft.HELP_BLOCK_COLOUR_ = 290;

Blockly.ComputerCraft.HELP_FUNCS_ = [
  {funcName: 'path',
   text: 'get help path',
   output: 'String',
   tooltip:
   'Get the list of locations that will be searched for help files,\n' +
   'as a string containing multiple search paths separated by colons.'},
  {funcName: 'setPath',
   text: 'set help path to %1',
   args: [['PATH', 'String']],
   tooltip:
   'Set the list of locations to be searched for help files.\n' +
   'The input should be a string containing search paths separated by colons.'},
  {funcName: 'lookup',
   text: 'get help path for %1',
   args: [['TOPIC', 'String']],
   tooltip:
   'Get the path to the file containing the help page for the given topic.\n' +
   'If it cannot be found, the result will be null.'},
  {funcName: 'topics',
   text: 'get list of help topics',
   tooltip: 'Get a list of all available help topics.',
   output: 'List'}];

Blockly.ComputerCraft.HELP_FUNCS_.forEach(function(info) {
  Blockly.ComputerCraft.buildValueBlock(
    'help', Blockly.ComputerCraft.HELP_BLOCK_COLOUR_, info);});
