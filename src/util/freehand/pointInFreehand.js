/**
* Calculates if "point" is inside the polygon defined by dataHandles by counting
* the number of times a ray originating from "point" crosses the edges of the
* polygon. Odd === inside, Even === outside. The bool "inROI" flips every time
* the ray originating from location and pointing to the right crosses a
* linesegment.
*/

/**
* Returns true if the location is inside the polygon defined by dataHandles.
*
* @param {Object} dataHandles - Data object associated with the tool.
* @param {Object} location - The coordinates being queried.
* @return {Boolean} True if the location is inside the polygon defined by dataHandles.
*/
export default function (dataHandles, location) {
  let inROI = false;

  // Cycle round pairs of points
  let j = dataHandles.length - 1; // The last vertex is the previous one to the first

  for (let i = 0; i < dataHandles.length; i++) {
    if (rayFromPointCrosssesLine(location, dataHandles[i], dataHandles[j])) {
      inROI = !inROI;
    }

    j = i; // Here j is previous vertex to i
  }

  return inROI;
}


/**
* Returns true if the y-position yp is enclosed within y-positions y1 and y2.
*
* @param {Number} yp - The y position of point p.
* @param {Number} y1 - The y position of point 1.
* @param {Number} y2 - The y position of point 2.
* @return {Boolean} True if the y-position yp is enclosed within y-positions y1 and y2.
*/
function isEnclosedY (yp, y1, y2) {
  if ((y1 < yp && yp < y2) || (y2 < yp && yp < y1)) {
    return true;
  }

  return false;
}

/**
* Returns true if the line segment is to the right of the point.
*
* @param {Object} point - The point being queried.
* @param {Object} lp1 - The first point of the line segment.
* @param {Object} lp2 - The second point of the line segment.
* @return {Boolean} True if the line is to the right of the point.
*/
function isLineRightOfPoint (point, lp1, lp2) {
  // If both right of point return true
  if (lp1.x > point.x && lp2.x > point.x) {
    return true;
  }

  // Catch when line is vertical.
  if (lp1.x === lp2.x) {
    return (point.x < lp1.x);
  }

  // Put leftmost point in lp1
  if (lp1.x > lp2.x) {
    const lptemp = lp1;

    lp1 = lp2;
    lp2 = lptemp;
  }
  const lPointY = lineSegmentAtPoint(point, lp1, lp2);

  // If the lp1.x and lp2.x enclose point.x check gradient of line and see if
  // Point is above or below the line to calculate if it inside.
  if (Math.sign(lPointY.gradient) * point.y > lPointY.value) {
    return true;
  }

  return false;
}

/**
* Returns the y value of the line segment at the x value of the point.
*
* @param {Object} point - The point being queried.
* @param {Object} lp1 - The first point of the line segment.
* @param {Object} lp2 - The second point of the line segment.
* @return {Object} An object containing the y value as well as the gradient of the line segment.
*/
function lineSegmentAtPoint (point, lp1, lp2) {
  const dydx = (lp2.y - lp1.y) / (lp2.x - lp1.x);
  const fx = {
    value: lp1.x + dydx * (point.x - lp1.x),
    gradient: dydx
  };

  return fx;
}

/**
* Returns true if a rightwards ray originating from the point crosses the line defined by handleI and handleJ.
*
* @param {Object} point - The point being queried.
* @param {Object} handleI - The first handle of the line segment.
* @param {Object} handleJ - The second handle of the line segment.
* @return {Boolean} True if a rightwards ray originating from the point crosses the line defined by handleI and handleJ.
*/
function rayFromPointCrosssesLine (point, handleI, handleJ) {
  if (isEnclosedY(point.y, handleI.y, handleJ.y) && isLineRightOfPoint(point, handleI, handleJ)) {

    return true;
  }

  return false;
}
