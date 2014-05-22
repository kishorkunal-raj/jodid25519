/**
 * @fileOverview
 * Curve25519 timing tests.
 */

/*
 * Created: 21 May 2014 Guy K. Kloss <gk@mega.co.nz>
 *
 * (c) 2014 by Mega Limited, Wellsford, New Zealand
 *     http://mega.co.nz/
 *     MIT License.
 *
 * You should have received a copy of the license along with this
 * program.
 */

(function() {
    "use strict";

    var assert = chai.assert;

    var MIN_TESTS = 50;
    var NUM_TESTS = _td.testVectors.length;
    var MAX_TEST_DURATION = 10000; // Duration in milliseconds.

    var arraySum = function(values) {
        return values.reduce(function(a, b) {
            return a + b;
        }, 0);
    };

    var timeIt = function(timings, f) {
        var start = Date.now();
        var r = f();
        var end = Date.now();
        timings.push(end - start);
        return r;
    };

    var timingStatsText = function(timings) {
        var max = Math.max.apply(null, timings);
        var min = Math.min.apply(null, timings);
        var mean = arraySum(timings) / timings.length;
        var esq = arraySum(timings.map(function(x) { return x * x; })) / timings.length;
        var stdev = Math.sqrt(esq - mean*mean);
        var maxpc = ((max - mean) / mean * 100).toFixed(2);
        var minpc = ((mean - min) / mean * 100).toFixed(2);
        var stdevpc = (stdev / mean * 100).toFixed(2);
        return ("(" + timings.length + " tested): " + mean.toFixed(2)
                + " ms, +" + maxpc + "%, -" + minpc + "%, ~" + stdevpc + "%");
    };

    if (window.CURVE25519_TEST_TIMING) {
        // Only run this if we're doing timing tests.
        describe("Curve25519 timing tests)", function() {
            it('curve25519()', function() {
                var timings = [];
                for (var i = 0; arraySum(timings) < MAX_TEST_DURATION
                        && i < NUM_TESTS || i < MIN_TESTS; i++) {
                    // Fields on each record in vector:
                    // e, k, ek
                    var vector = _td.testVectors[i];
                    var e = _tu.decodeVector(vector[0]);
                    var k = _tu.decodeVector(vector[1]);
                    timeIt(timings, function() { return curve255.curve25519(e, k); });
                }
                console.log('Duration per curve25519() call ' + timingStatsText(timings));
            });
            
            it('curve25519_raw()', function() {
                var timings = [];
                for (var i = 0; arraySum(timings) < MAX_TEST_DURATION
                        && i < NUM_TESTS || i < MIN_TESTS; i++) {
                    // Fields on each record in vector:
                    // e, k, ek
                    var vector = _td.testVectors[i];
                    var e = _tu.decodeVector(vector[0]);
                    var k = _tu.decodeVector(vector[1]);
                    timeIt(timings, function() { return curve255.curve25519_raw(e, k); });
                }
                console.log('Duration per curve25519_raw() call ' + timingStatsText(timings));
            });
        });
    }
})();
