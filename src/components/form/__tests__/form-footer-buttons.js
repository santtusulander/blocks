import React from 'react';
import { shallow } from 'enzyme'

jest.unmock('../form-footer-buttons.jsx');
import FormFooterButtons from '../form-footer-buttons.jsx'

describe('FormFooterButtons', function() {
  let subject = null

  beforeEach(() => {
    subject = (align, children = [<div className="test" key="test">test</div>]) => {
      const props = {
        align
      }

      return shallow(
        <FormFooterButtons {...props}>
          {children}
        </FormFooterButtons>
      )
    }
  })

  it('should exist', () => {
    expect(subject().length).toBe(1)
  })

  it('should render div', () => {
    expect(subject().find('.test').length).toBe(1)
  })

  describe('modal footer container', () => {
    const cssClass = 'modal-footer'

    it('should exist', () => {
      expect(subject().find(`.${cssClass}`).length).toBe(1)
    })

    it('should be the first node (wrapper)', () => {
      expect(subject().first().hasClass(cssClass)).toBeTruthy()
    })

    describe('footer alignment acceptable values: "left" | "center" | "right"', () => {
      let footer = null;

      beforeEach(() => {
        footer = (align) => subject(align).first()
      })

      it('should be "right" by default ', () => {
        expect(footer().html()).toMatch(/<div class="modal-footer" style="text-align:right;">/)
      })

      it('allow "left"', () => {
        expect(footer('left').html()).toMatch(/<div class="modal-footer" style="text-align:left;">/)
      })

      it('allow "right"', () => {
        expect(footer('right').html()).toMatch(/<div class="modal-footer" style="text-align:right;">/)
      })

      it('allow "center"', () => {
        expect(footer('center').html()).toMatch(/<div class="modal-footer" style="text-align:center;">/)
      })
    });
  });
});
