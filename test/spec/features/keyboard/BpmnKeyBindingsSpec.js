'use strict';

var TestHelper = require('../../../TestHelper');

var TestContainer = require('mocha-test-container-support');

var coreModule = require('../../../../lib/core'),
    modelingModule = require('../../../../lib/features/modeling'),
    keyboardModule = require('../../../../lib/features/keyboard'),
    selectionModule = require('diagram-js/lib/features/selection'),
    spaceToolModule = require('diagram-js/lib/features/space-tool'),
    lassoToolModule = require('diagram-js/lib/features/lasso-tool');

/* global bootstrapViewer, inject, sinon */


function createKeyEvent(element, code, ctrlKey) {
  var e = document.createEvent('Events');

  if (e.initEvent) {
    e.initEvent(event, true, true);
  }

  e.keyCode = code;
  e.which = code;
  e.ctrlKey = ctrlKey;

  return e;
}


describe('features - keyboard', function() {

  var diagramXML = require('../../../fixtures/bpmn/simple.bpmn');

  var testModules = [
    coreModule,
    modelingModule,
    selectionModule,
    spaceToolModule,
    lassoToolModule,
    keyboardModule
  ];

  beforeEach(bootstrapViewer(diagramXML, { modules: testModules }));

  describe('bpmn key bindings', function() {

    var container;

    beforeEach(function() {
      container = TestContainer.get(this);
    });


    it('should trigger lasso tool', inject(function(keyboard, lassoTool) {

      sinon.spy(lassoTool, 'activateSelection');

      // given
      var e = createKeyEvent(container, 76, false);

      // when
      keyboard._keyHandler(e);

      // then
      expect(lassoTool.activateSelection.calledOnce).to.be.true;
    }));


    it('should trigger space tool', inject(function(keyboard, spaceTool) {

      sinon.spy(spaceTool, 'activateSelection');

      // given
      var e = createKeyEvent(container, 83, false);

      // when
      keyboard._keyHandler(e);

      // then
      expect(spaceTool.activateSelection.calledOnce).to.be.true;
    }));


    it('should trigger direct editing', inject(function(keyboard, selection, elementRegistry, directEditing) {

      sinon.spy(directEditing, 'activate');

      // given
      var task = elementRegistry.get('Task_1');

      selection.select(task);

      var e = createKeyEvent(container, 69, false);

      // when
      keyboard._keyHandler(e);

      // then
      expect(directEditing.activate.calledOnce).to.be.true;
    }));


    it('should select all elements', inject(function(canvas, keyboard, selection, elementRegistry) {

      // given
      var e = createKeyEvent(container, 65, true);

      var allElements = elementRegistry.getAll(),
          rootElement = canvas.getRootElement();

      // when
      keyboard._keyHandler(e);

      // then
      var selectedElements = selection.get();

      expect(selectedElements).to.have.length.of(allElements.length - 1);
      expect(selectedElements).not.to.contain(rootElement);
    }));

  });

});