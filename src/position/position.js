angular.module('ui.bootstrap.position', [])

/**
 * A set of utility methods that can be use to retrieve position of DOM elements.
 * It is meant to be used where we need to absolute-position DOM elements in
 * relation to other, existing elements (this is the case for tooltips, popovers,
 * typeahead suggestions etc.).
 */
  .factory('$position', ['$document', '$window', function ($document, $window) {

    function getStyle(el, cssprop) {
      if (el.currentStyle) { //IE
        return el.currentStyle[cssprop];
      } else if ($window.getComputedStyle) {
        return $window.getComputedStyle(el)[cssprop];
      }
      // finally try and get inline style
      return el.style[cssprop];
    }

    /**
     * Checks if a given element is statically positioned
     * @param element - raw DOM element
     */
    function isStaticPositioned(element) {
      return (getStyle(element, 'position') || 'static' ) === 'static';
    }

    /**
     * returns the closest, non-statically positioned parentOffset of a given element
     * @param element
     */
    function parentOffsetEl(element) {
      var docDomEl = $document[0];
      var offsetParent = element.offsetParent || docDomEl;
      while (offsetParent && offsetParent !== docDomEl && isStaticPositioned(offsetParent) ) {
        offsetParent = offsetParent.offsetParent;
      }
      return offsetParent || docDomEl;
    }

    function getWindowBounds() {
      var windowSize = getWindowSize(),
        scrollOffsets = getScrollOffsets();

      return {
        left: 0 + scrollOffsets.x,
        right: (windowSize.innerWidth + scrollOffsets.x - 20), //-20 to avoid scrollbars
        top: 0 + scrollOffsets.y,
        bottom: (windowSize.innerHeight + scrollOffsets.y)
      };
    }

    function getWindowSize() {
      if('innerWidth' in $window){
        return {
          innerWidth: $window.innerWidth,
          innerHeight: $window.innerHeight
        };
      }

      // For browsers in Standards mode
      if ( $document[0].compatMode === 'CSS1Compat' ) {
        return {
          innerWidth: $document[0].documentElement.clientWidth,
          innerHeight: $document[0].documentElement.clientHeight
        };
      }

      // For browsers in Quirks mode
      return {
        innerWidth: $document[0].body.clientWidth,
        innerHeight: $document[0].body.clientHeight
      };
    }

    function getScrollOffsets() {
      // This works for all browsers except =< IE 8
      if ('pageXOffset' in $window) {
        return {
          x: $window.pageXOffset,
          y: $window.pageYOffset
        };
      }

      // For browsers in Standards mode
      if ( $document[0].compatMode === 'CSS1Compat' ) {
        return {
          x: $document[0].documentElement.scrollLeft,
          y: $document[0].documentElement.scrollTop
        };
      }

      // For browsers in Quirks mode
      return {
        x: $document[0].body.scrollLeft,
        y: $document[0].body.scrollTop
      };
    }

    return {
      /**
       * Provides read-only equivalent of jQuery's position function:
       * http://api.jquery.com/position/
       */
      position: function (element) {
        var elBCR = this.offset(element);
        var offsetParentBCR = { top: 0, left: 0 };
        var offsetParentEl = parentOffsetEl(element[0]);
        if (offsetParentEl != $document[0]) {
          offsetParentBCR = this.offset(angular.element(offsetParentEl));
          offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
          offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
        }

        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: elBCR.top - offsetParentBCR.top,
          left: elBCR.left - offsetParentBCR.left
        };
      },

      /**
       * Provides read-only equivalent of jQuery's offset function:
       * http://api.jquery.com/offset/
       */
      offset: function (element) {
        var boundingClientRect = element[0].getBoundingClientRect();
        return {
          width: boundingClientRect.width || element.prop('offsetWidth'),
          height: boundingClientRect.height || element.prop('offsetHeight'),
          top: boundingClientRect.top + ($window.pageYOffset || $document[0].documentElement.scrollTop),
          left: boundingClientRect.left + ($window.pageXOffset || $document[0].documentElement.scrollLeft)
        };
      },

      /**
       * Provides coordinates for the targetEl in relation to hostEl
       */
      positionElements: function (hostEl, targetEl, positionStr, appendToBody) {
        var hostElPos,
          targetElWidth,
          targetElHeight,
          targetElPos = {
            top: 0,
            left: 0,
            placement: positionStr
          };

        if(!positionStr) {
          return targetElPos;
        }

        var autoToken = /\s?auto?\s?/i;
        var autoPlace = autoToken.test(positionStr);
        if (autoPlace) { positionStr = positionStr.replace(autoToken, '') || 'top'; }
        var positionStrParts = positionStr.split('-');
        var pos0 = positionStrParts[0], pos1 = positionStrParts[1] || 'center';

        hostElPos = appendToBody ? this.offset(hostEl) : this.position(hostEl);

        targetElWidth = targetEl.prop('offsetWidth');
        targetElHeight = targetEl.prop('offsetHeight');

        // based on Twitter Bootstrap's logic
        if(autoPlace) {
          var containerPos = getWindowBounds();
          pos0 = (
            pos0 == 'bottom'  && hostElPos.top + hostElPos.height + targetElHeight  > containerPos.bottom ? 'top' :
            pos0 == 'top'     && hostElPos.top - targetElHeight                     < containerPos.top    ? 'bottom' :
            pos0 == 'right'   && hostElPos.left + hostElPos.width + targetElWidth   > containerPos.right  ? 'left' :
            pos0 == 'left'    && hostElPos.left - targetElWidth                     < containerPos.left   ? 'right' :
            pos0
          );

          targetElPos.placement = pos0 + (pos1 !== 'center' ? '-' + pos1 : '') + ' auto';
        }

        var shiftWidth = {
          center: function () {
            return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
          },
          left: function () {
            return hostElPos.left;
          },
          right: function () {
            return hostElPos.left + hostElPos.width;
          }
        };

        var shiftHeight = {
          center: function () {
            return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
          },
          top: function () {
            return hostElPos.top;
          },
          bottom: function () {
            return hostElPos.top + hostElPos.height;
          }
        };

        switch (pos0) {
          case 'right':
            targetElPos.top = shiftHeight[pos1]();
            targetElPos.left = shiftWidth[pos0]();
            break;
          case 'left':
            targetElPos.top = shiftHeight[pos1]();
            targetElPos.left = hostElPos.left - targetElWidth;
            break;
          case 'bottom':
            targetElPos.top = shiftHeight[pos0]();
            targetElPos.left = shiftWidth[pos1]();
            break;
          default:
            targetElPos.top = hostElPos.top - targetElHeight;
            targetElPos.left = shiftWidth[pos1]();
            break;
        }

        return targetElPos;
      }
    };
  }]);