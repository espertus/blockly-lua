/**
 * Blockly Lua: ComputerCraft SideInputBlock class
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
 * @fileoverview Class for ComputerCraft blocks having an input that can
 *     specify either a side or a named cable.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';
goog.provide('ComputerCraft.SideInputBlock');

goog.require('ComputerCraft.DependentInputBlock');

/**
 * Class for ComputerCraft blocks with a 'side' input (one of 'front', 'back',
 * 'left', 'right', 'top', 'bottom', or an arbitrary string identifying a
 * cable).  The block may also have both earlier inputs, provided through
 * info.text and info.args, and later inputs.  If an input is added after
 * the block is constructed, the method inputAdded() must be called.
 *
 * The side input and the dependent string input will be added on to the
 * end of the provided inputs, mutating the text and args arguments.  They
 * are named SIDE and CABLE, respectively.
 *
 * A question mark will be automatically added to the end of the block name if
 * the output (as specified in the 'info' parameter) is Boolean.
 *
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     The same fields are used as in the constructor of the parent class,
 *     Blockly.ComputerCraft.DependentInputBlock.  Notes:
 * @return {Blockly.ComputerCraft.SideInputBlock} The new block.
 */
Blockly.ComputerCraft.SideInputBlock = function(prefix, colour, info) {
  info.codeGenType =
      Blockly.ComputerCraft.ControllingInputCodeGenType.ONLY_IF_DEP_HIDDEN;
  Blockly.ComputerCraft.SideInputBlock.superClass_.constructor.call(
    this, prefix, colour, info);
};
goog.inherits(Blockly.ComputerCraft.SideInputBlock,
    Blockly.ComputerCraft.DependentInputBlock);

Blockly.ComputerCraft.SideInputBlock.SIDES_ =
    [['in front', 'front'],
     ['in back', 'back'],
     ['to the left', 'left'],
     ['to the right', 'right'],
     ['above', 'top'],
     ['below', 'bottom'],
     ['through cable...', 'cable']];

/**
 * Create a block that has a side input.
 *
 * @param {string} prefix A ComputerCraft API name, such as 'turtle'.
 * @param {number} colour The block colour, an HSV hue value.
 * @param {Object} info Information about the block being defined.
 *     In addition to the fields used by the Blockly.ComputerCraft.SideInputBlock
 *     constructor, this has:
 *     <ul>
 *     <li>suppressLua {boolean} If true, no Lua code generator is created.
 *     </ul>
 * @return {Blockly.ComputerCraft.SideInputBlock} The new block.
 */
Blockly.ComputerCraft.buildSideInputBlock = function(prefix, colour, info) {
  if (!info.helpUrlType) {
    info.helpUrlType = Blockly.ComputerCraft.HelpUrlType.PREFIX_NAME;
  }
  if (!info.args) {
    info.args = [];
  }
  // Add SIDE and CABLE inputs to info.text.
  // A dummy input will be inserted in DependentInputBlock.init().
  info.text += ' %' + (info.args.length + 1) + ' %' + (info.args.length + 2);
  // Add SIDE and CABLE inputs to info.args.
  info.args.push(['SIDE', Blockly.ComputerCraft.SideInputBlock.SIDES_]);
  info.args.push(['CABLE', 'String']);

  // Explicitly set the dependent block attributes; otherwise, info.args will be
  // mutated in setDependenceInfo_().
  info.ddName = 'SIDE';    // This is the controlling dropdown menu.
  info.ddValue = 'cable';  // This is the value for showing the dependent input.
  info.depName = 'CABLE';  // This is the dependent input.
  info.depType = 'String';

  // Add question mark at end of text if the block is a predicate.
  if (info.output == 'Boolean') {
    info.text += '?';
  };

  // Build block.
  var newBlock = new Blockly.ComputerCraft.SideInputBlock(prefix, colour, info);
  Blockly.Blocks[newBlock.blockName] = newBlock;
  if (!info.suppressLua) {
    Blockly.Lua[newBlock.blockName] =
        Blockly.ComputerCraft.Block.prototype.generateLua;
  }
  return newBlock;
};
