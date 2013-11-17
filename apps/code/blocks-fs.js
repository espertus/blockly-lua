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

BlocklyLua.FS_BLOCK_COLOUR_ = 410;

BlocklyLua.FS_FUNCS_ = [
  {name: 'list',
   output: 'Table',
   text: 'list files in %1',
   args: [['DIR', 'String']],
   tooltip:
   'Returns a list of all the files\n' +
   '(including subdirectories but not their contents)\n' +
   'contained in a directory, as a numerically indexed table.'},
  {name: 'exists',
   output: 'Boolean',
   text: 'path %1 exists?',
   args: [['PATH', 'String']],
   tooltip:
   'Checks if its input refers to an existing file or directory,\n' +
   'returning true if it does, false otherwise'},
  {name: 'isReadOnly',
   output: 'Boolean',
   text: 'is path %1 read-only?',
   args: [['PATH', 'String']],
   tooltip:
   'Checks if a file or directory is read-only (cannot be modified),\n' +
   'returning true if it is, false otherwise'},
  {name: 'getName',
   output: 'String',
   text: 'get file name from path %1',
   args: [['PATH', 'String']],
   tooltip:
   'Gets the final part (file name) from a path'},
  {name: 'getDrive',
   output: 'String',
   text: 'get drive type for path %1',
   args: [['PATH', 'String']],
   tooltip:
   'Returns the type of the storage medium holding a path,\n' +
   'or nil if the path does not exist. This is one of\n' +
   '“hdd” if the path is stored on the computer’s local hard drive,\n' +
   '“rom” if the path is in ROM, or the side on which a disk drive\n' +
   'is attached if the path is on a floppy disk.'},
  {name: 'getSize',
   output: 'Number',
   text: 'get size of file %1',
   args: [['PATH', 'String']],
   tooltip: 'Gets the amount of space taken up by the file, in bytes.\n'},
  {name: 'getFreeSpace',
   output: 'Number',
   text: 'get amount of free space in %1',
   args: [['DIR', 'String']],
   tooltip: 'Gets the amount of free space in the given directory, in bytes.'},
  {name: 'makeDir',
   stmtConns: BlocklyLua.StmtConns.PREVIOUS | BlocklyLua.StmtConns.NEXT,
   text: 'create directory %1',
   args: [['DIR', 'String']],
   tooltip:
   'Creates a directory with the given path,\n' +
   'creating any missing parent components.\n' +
   'If the location is already a directory, nothing changes.\n' +
   'If the location is already a file, an error occurs.'},
  {name: 'move',
   stmtConns: BlocklyLua.StmtConns.PREVIOUS | BlocklyLua.StmtConns.NEXT,
   text: 'move file/directory from %1 to %2',
   args: [['PATH1', 'String'], ['PATH2', 'String']],
   tooltip: 'Moves a file or directory to a new location.\n' +
   'The parent of the new location must be an existing writeable directory.\n' +
   'The second input must include a file name and that file must not yet exist.'
  },
  {name: 'copy',
   stmtConns: BlocklyLua.StmtConns.PREVIOUS | BlocklyLua.StmtConns.NEXT,
   text: 'copy file/directory from %1 to %2',
   args: [['PATH1', 'String'], ['PATH2', 'String']],
   tooltip: 'Copies a file or directory to a new location.\n' +
   'The parent of the new location must be an existing writeable directory.\n' +
   'The second input must include a file name and that file must not yet exist.'
  },
  {name: 'delete',
   stmtConns: BlocklyLua.StmtConns.PREVIOUS | BlocklyLua.StmtConns.NEXT,
   text: 'delete file/directory %1',
   args: [['PATH', 'String']],
   tooltip: 'Deletes a file or directory and its contents.\n' +
   'Nothing happens if the file/directory does not exist.'},
  {name: 'combine',
   output: 'String',
   text: 'combine file paths %1 and %2',
   args: [['PATH1', 'String'], ['PATH2', 'String']],
   tooltip: 'Combines two path components, returning a path\n' +
   'consisting of the second path nexted in the first path.\n' +
   'Neither path needs to exist; this function only manipulates strings.'}
];

for (var i = 0; i < BlocklyLua.FS_FUNCS_.length; i++) {
  BlocklyLua.buildValueBlock(
    'fs', BlocklyLua.FS_BLOCK_COLOUR_, BlocklyLua.FS_FUNCS_[i]);
};
