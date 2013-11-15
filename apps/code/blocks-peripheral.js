/**
 * Blockly Apps: Blockly Lua
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
 * @fileoverview Blocks for ComputerCraft peripherals.
 * @author ellen.spertus@gmail.com (Ellen Spertus)
 */
'use strict';

BlocklyLua.BASE_PERIPHERAL_HELP_URL_ = BlocklyLua.BASE_HELP_URL + 'Peripheral.';
BlocklyLua.PERIPHERAL_BLOCK_COLOUR_ = 65;

BlocklyLua.SIDES_ = [['in front', 'front'],
                     ['in back', 'back'],
                     ['to the left', 'left'],
                     ['to the right', 'right'],
                     ['above', 'top'],
                     ['below', 'bottom'],
                     ['through cable...', 'cable']];

Blockly.Blocks['peripheral_is_present'] = {
  // Block for testing whether a peripheral is present on the given side.
  init: function() {
    this.setColour(BlocklyLua.PERIPHERAL_BLOCK_COLOUR_);
    var thisBlock = this;
    this.appendDummyInput()
        .appendTitle('is peripheral present');
    this.appendDummyInput()
        .appendTitle(
          new Blockly.FieldDropdown(
            BlocklyLua.SIDES_,
            function(value) {
              if (value == 'cable') {
                if (!thisBlock.cableMode) {
                  thisBlock.enterCableMode();
                }
              } else {
                if (thisBlock.cableMode) {
                  thisBlock.leaveCableMode();
                }
              }
            }),
          'SIDES');
    this.setOutput(true, 'Boolean');
    this.cableMode = false;
    this.setInputsInline(true);
    this.setTooltip(
      'Return true if a peripheral is connected on the specified side.');
    this.setHelpUrl(BlocklyLua.BASE_PERIPHERAL_HELP_URL_ + 'isPresent');
  },
  enterCableMode: function() {
    var textBlock = new Blockly.Block(this.workspace, 'text');
    textBlock.initSvg();
    textBlock.render();
    this.appendValueInput('TEXT')
        .setCheck('String')
        .connection.connect(textBlock.outputConnection);
    this.cableMode = true;
  },
  leaveCableMode: function() {
    this.removeInput('TEXT', true);
    this.cableMode = false;
  },
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('cable_mode', this.cableMode);
    return container;
  },
  domToMutation: function(xmlElement) {
    this.cableMode = xmlElement.getAttribute('cable_mode') == 'true';
    if (this.cableMode) {
      this.appendValueInput('TEXT')
          .setCheck('String');
    }
  }
};
