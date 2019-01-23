/** Form used to enable modification of a Geometry */
L.StyleEditor.forms.FlowForm = L.StyleEditor.forms.Form.extend({
    options: {
        formElements: {
            'color': L.StyleEditor.formElements.ColorElement,
            'arcWidth': L.StyleEditor.formElements.WeightElement,
            'pulseRadius':L.StyleEditor.formElements.WeightElement,
            'pulseBorderWidth':L.StyleEditor.formElements.WeightElement
        }
    },

    /** show the fillOptions (fillColor and fillOpacity) only if the Element can be filled */
    showFormElements: function () {
        for (var i = 0; i < this.options.initializedElements.length; i++) {
            
            this.options.initializedElements[i].show();
            

        };
    }
});
