function findGraphAxesRange() {
    if (g.plotType == MICH_MENT) {
        graph.setLabelRanges([0, 10], [0, 2]);
        return;
    }

    let x = [-3, 3];
    let y = [0, 3];
    switch (g.mechType) {
        case COMPETITIVE:
            break;
        case UNCOMPETITIVE:
            x = [-7, 7];
            break;
        case NONCOMPETITIVE:
            y = [0, 14];
            break;
        case SELF_INHIBITED:
            x = [0, 2];
            break;
    }
    graph.setLabelRanges(x, y);
    return;
}