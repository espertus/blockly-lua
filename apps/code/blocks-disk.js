/**
 * Blockly Lua: ComputerCraft Disk API
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
 * @fileoverview Blocks for ComputerCraft Disk API.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

Blockly.ComputerCraft.DISK_BLOCK_COLOUR_ = 290;

Blockly.ComputerCraft.DISK_FUNCS_ = [
  {funcName: 'isPresent',
   output: 'Boolean',
   text: 'is an item in disk drive',
   tooltip:
   'Check whether any item (such as a music disk or floppy disk)\n'+
   'is present in the adjacent disk drive.'},
  {funcName: 'hasData',
   output: 'Boolean',
   text: 'is floppy disk in drive',
   tooltip:
   'Check whether a floppy disk (as opposed to a music disk) is in the drive.'
  },
  {funcName: 'getMountPath',
   output: 'String',
   text: 'get mount path for floppy disk in drive',
   tooltip:
   'Get the directory name where the contents\n' +
   'of the floppy disk can be accessed.'},
  {funcName: 'getLabel',
   text: 'read label on floppy disk in drive',
   output: 'String',
   tooltip: 'Read the label of the floppy disk in the drive.'},
  {funcName: 'getID',
   text: 'get ID of floppy disk in drive',
   output: 'Number',
   tooltip: 'Get the floppy disk\'s unique numeric identifier.'},
  {funcName: 'hasAudio',
   text: 'is music disk in drive',
   output: 'Boolean',
   tooltip: 'Check if a music disk is in the drive.'},
  {funcName: 'getAudioTitle',
   text: 'get title of music disk in drive',
   output: 'String',
   tooltip: 'Get the title of the music disk in the drive.'},
  {funcName: 'playAudio',
   text: 'play music disk in drive',
   tooltip: 'Starts playing the music disk in the drive.'},
  {funcName: 'stopAudio',
   text: 'stop music disk in drive',
   tooltip: 'Stop playing the music disk in the drive.'},
  {funcName: 'eject',
   text: 'eject from drive',
   tooltip:
   'Eject any item currently in the drive,\n' +
   'spilling it into the world as a loose item.'},
  // The resulting block will get modified after the loop.
  {funcName: 'setLabel',
   text: 'Set the label on the disk in drive',
   tooltip: 'Writes a label to the floppy disk in the attached drive.'}];

for (var i = 0; i < Blockly.ComputerCraft.DISK_FUNCS_.length; i++) {
  Blockly.ComputerCraft.buildBlockWithSide(
    'disk',
    Blockly.ComputerCraft.DISK_BLOCK_COLOUR_,
    Blockly.ComputerCraft.DISK_FUNCS_[i]);
};

Blockly.Blocks['disk_set_label'].init = function() {
  Blockly.ComputerCraft.BlockWithSide.prototype.init.call(this);
  this.appendValueInput('LABEL')
      .setCheck('String')
      .appendTitle('to');
};

Blockly.Blocks['disk_set_label'].enterCableMode = function() {
  Blockly.ComputerCraft.BlockWithSide.prototype.enterCableMode.call(this);
  // The cable input was added to the end.  Move it before the label name.
  this.moveInputBefore('CABLE', 'LABEL');
};
