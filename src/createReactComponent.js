import { forwardRef, createElement } from "react";
import PropTypes from "prop-types";
import defaultAttributes from "./defaultAttributes";

export default (iconName, iconNamePascal, iconNode) => {
  const Component = forwardRef(
    (
      { color = "currentColor", size = 24, stroke = 0, children, ...rest },
      ref
    ) =>
      createElement(
        "svg",
        {
          ref,
          ...defaultAttributes,
          width: size,
          height: size,
          stroke: color,
          strokeWidth: stroke,
          className: `weberlo-icon weberlo-icon-${iconName}`,
          ...rest,
        },
        [...handleChildrenRender(iconNode), ...(children || [])]
      )
  );

  const handleChildrenRender = (iconNode) => {
    return iconNode.map(([tag, attrs, node]) => {
      if (node && typeof node === "object" && isIterable(node)) {
        return createElement(tag, attrs, [...handleChildrenRender(node)]);
      } else {
        return createElement(tag, attrs);
      }
    });
  };

  function isIterable(obj) {
    if (obj == null) {
      return false;
    }
    return typeof obj[Symbol.iterator] === "function";
  }

  Component.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    stroke: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  Component.displayName = `${iconNamePascal}`;

  return Component;
};
