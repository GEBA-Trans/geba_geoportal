import { stepLength } from './settings.js';

export function getPathPoints(path, useSimplified = false) {
    const points = [];
    const dAttribute = useSimplified ? 'data-simplified-d' : 'd';
    const pathData = path.getAttribute(dAttribute);

    if (!pathData) {
        console.warn(`Path ${path.id} does not have a ${dAttribute} attribute.`);
        return { points, svg: path.ownerSVGElement };
    }

    const pathLength = path.getTotalLength();
    const svg = path.ownerSVGElement;
    for (let i = 0; i <= pathLength; i += stepLength) {
        const point = path.getPointAtLength(i);
        if (!points.some(p => p.x === point.x && p.y === point.y)) {
            points.push(point);
        }
    }
    return { points, svg };
}

export function isPointInPolygon(point, polygon) {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].x, yi = polygon[i].y;
        const xj = polygon[j].x, yj = polygon[j].y;

        const intersect = ((yi > point.y) !== (yj > point.y))
            && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
}

export function isBBoxInPolygon(bbox, polygon) {
    const bboxPoints = [
        { x: bbox.x, y: bbox.y },
        { x: bbox.x + bbox.width, y: bbox.y },
        { x: bbox.x, y: bbox.y + bbox.height },
        { x: bbox.x + bbox.width, y: bbox.y + bbox.height }
    ];
    // 1. Any bbox corner inside polygon
    if (bboxPoints.some(point => isPointInPolygon(point, polygon))) return true;
    // 2. Any polygon vertex inside bbox
    if (polygon.some(p => p.x >= bbox.x && p.x <= bbox.x + bbox.width && p.y >= bbox.y && p.y <= bbox.y + bbox.height)) return true;
    // 3. Any edge intersection (bbox edge with polygon edge)
    function edges(poly) {
        return poly.map((p, i) => [p, poly[(i + 1) % poly.length]]);
    }
    const bboxEdges = edges(bboxPoints);
    const polyEdges = edges(polygon);
    function segmentsIntersect(a, b, c, d) {
        // Returns true if line segments ab and cd intersect
        function ccw(p1, p2, p3) {
            return (p3.y - p1.y) * (p2.x - p1.x) > (p2.y - p1.y) * (p3.x - p1.x);
        }
        return (ccw(a, c, d) !== ccw(b, c, d)) && (ccw(a, b, c) !== ccw(a, b, d));
    }
    for (const [a, b] of bboxEdges) {
        for (const [c, d] of polyEdges) {
            if (segmentsIntersect(a, b, c, d)) return true;
        }
    }
    return false;
}

export function isPathInSelection(path, polygon) {
    const { points } = getPathPoints(path);
    return points.some(point => isPointInPolygon(point, polygon)) || isPointInPolygon(points[0], polygon);
}

// Merge two polygons into a single convex hull
export function mergePolygons(polygon1, polygon2) {
    if (polygon1.length === 0) return polygon2;
    if (polygon2.length === 0) return polygon1;
    const allPoints = [...polygon1, ...polygon2];
    return mergePointSetsToHull(allPoints);
}

// Compute the convex hull of a set of points
export function mergePointSetsToHull(points) {
    points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    const cross = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const mergeHulls = (hull1, hull2) => {
        const allPoints = [...hull1, ...hull2];
        allPoints.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
        const lower = [];
        for (const point of allPoints) {
            while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], point) <= 0) {
                lower.pop();
            }
            lower.push(point);
        }
        const upper = [];
        for (let i = allPoints.length - 1; i >= 0; i--) {
            const point = allPoints[i];
            while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], point) <= 0) {
                upper.pop();
            }
            upper.push(point);
        }
        upper.pop();
        lower.pop();
        return lower.concat(upper);
    };
    let mergedHull = [];
    for (let i = 0; i < points.length - 1; i++) {
        const pair = [points[i], points[i + 1]];
        const pairHull = mergeHulls(pair, []);
        mergedHull = mergeHulls(mergedHull, pairHull);
    }
    return mergedHull;
}