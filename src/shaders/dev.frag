precision highp float;

#define PI		3.1415926535897931

const 	vec3	ofreq	=	vec3(8.0, 8.0, 8.0),		// Frequency of iridescent orientantion part.
				nfreq	=	vec3(4.0, 4.0, 4.0),		// Frequency of iridescent noise part.
				ooset	=	vec3(0.0, 0.0, 0.0),		// Offset of iridescent orientantion part.
				noset	=	vec3(0.0, 0.0, 0.0);		// Offset of iridescent noise part.
const 	float	nmult	=	1.0,						// Controls the intensity of noise.
				gamma	=	0.75,						// Gamma correction applied to incidence value (fr).
				minvl	=	0.0;						// Incident distribution curve control, applied after gamma correction.

uniform float iGlobalTime;

varying vec4	P;
varying float	fr;

float setRange(float value, float oMin, float oMax, float iMin, float iMax){
	return iMin + ((value - oMin)/(oMax - oMin))*(iMax - iMin);
}

float diNoise(vec3 freq, vec3 offset){
	// noise function to create irregularity
	return	sin(2.0*PI*P.x*freq.x*2.0 + 12.0 + offset.x) + cos(2.0*PI*P.z*freq.x + 21.0 + offset.x)*
			sin(2.0*PI*P.y*freq.y*2.0 + 23.0 + offset.y) + cos(2.0*PI*P.y*freq.y + 32.0 + offset.y)*
			sin(2.0*PI*P.z*freq.z*2.0 + 34.0 + offset.z) + cos(2.0*PI*P.x*freq.z + 43.0 + offset.z);
}

vec3 iridescence(	float orient, float noiseMult,
					vec3 freqA, vec3 offsetA, vec3 freqB, vec3 offsetB){
	// this function returns a iridescence value based on orientation
	vec3 irid;
	irid.x = abs(cos(2.0*PI*orient*freqA.x + diNoise(freqB, offsetB)*noiseMult + 1.0 + offsetA.x));
	irid.y = abs(cos(2.0*PI*orient*freqA.y + diNoise(freqB, offsetB)*noiseMult + 2.0 + offsetA.y));
	irid.z = abs(cos(2.0*PI*orient*freqA.z + diNoise(freqB, offsetB)*noiseMult + 3.0 + offsetA.z));
	return irid;
}


void main() {
    vec3 _iridColor;
    float _space, _incidence;
    _space = pow(1.0 - fr, 1.0/gamma);
    _incidence = setRange(_space, 0.0, 1.0, minvl, 1.0);
    _iridColor = iridescence(fr, nmult, ofreq, ooset, nfreq, noset);
// _iridColor = iridescence(fr + (iGlobalTime * 0.1), nmult, ofreq, ooset, nfreq, noset);


    gl_FragColor = vec4(_iridColor, 1.0) * _incidence;

//    gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0);
}
















//vec4 mod289_0(vec4 x)
//{
//  return x - floor(x * (1.0 / 289.0)) * 289.0;
//}
//
//vec4 permute_0(vec4 x)
//{
//  return mod289_0(((x*34.0)+1.0)*x);
//}
//
//vec4 taylorInvSqrt(vec4 r)
//{
//  return 1.79284291400159 - 0.85373472095314 * r;
//}
//
//vec2 fade(vec2 t) {
//  return t*t*t*(t*(t*6.0-15.0)+10.0);
//}
//
//// Classic Perlin noise
//float cnoise(vec2 P)
//{
//  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
//  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
//  Pi = mod289_0(Pi); // To avoid truncation effects in permutation
//  vec4 ix = Pi.xzxz;
//  vec4 iy = Pi.yyww;
//  vec4 fx = Pf.xzxz;
//  vec4 fy = Pf.yyww;
//
//  vec4 i = permute_0(permute_0(ix) + iy);
//
//  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
//  vec4 gy = abs(gx) - 0.5 ;
//  vec4 tx = floor(gx + 0.5);
//  gx = gx - tx;
//
//  vec2 g00 = vec2(gx.x,gy.x);
//  vec2 g10 = vec2(gx.y,gy.y);
//  vec2 g01 = vec2(gx.z,gy.z);
//  vec2 g11 = vec2(gx.w,gy.w);
//
//  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
//  g00 *= norm.x;
//  g01 *= norm.y;
//  g10 *= norm.z;
//  g11 *= norm.w;
//
//  float n00 = dot(g00, vec2(fx.x, fy.x));
//  float n10 = dot(g10, vec2(fx.y, fy.y));
//  float n01 = dot(g01, vec2(fx.z, fy.z));
//  float n11 = dot(g11, vec2(fx.w, fy.w));
//
//  vec2 fade_xy = fade(Pf.xy);
//  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
//  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
//  return 2.3 * n_xy;
//}
//vec3 mod289_1(vec3 x) {
//  return x - floor(x * (1.0 / 289.0)) * 289.0;
//}
//
//vec2 mod289_1(vec2 x) {
//  return x - floor(x * (1.0 / 289.0)) * 289.0;
//}
//
//vec3 permute_1(vec3 x) {
//  return mod289_1(((x*34.0)+1.0)*x);
//}
//
//float snoise(vec2 v)
//  {
//  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
//                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
//                     -0.577350269189626,  // -1.0 + 2.0 * C.x
//                      0.024390243902439); // 1.0 / 41.0
//// First corner
//  vec2 i  = floor(v + dot(v, C.yy) );
//  vec2 x0 = v -   i + dot(i, C.xx);
//
//// Other corners
//  vec2 i1;
//  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
//  //i1.y = 1.0 - i1.x;
//  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
//  // x0 = x0 - 0.0 + 0.0 * C.xx ;
//  // x1 = x0 - i1 + 1.0 * C.xx ;
//  // x2 = x0 - 1.0 + 2.0 * C.xx ;
//  vec4 x12 = x0.xyxy + C.xxzz;
//  x12.xy -= i1;
//
//// Permutations
//  i = mod289_1(i); // Avoid truncation effects in permutation
//  vec3 p = permute_1( permute_1( i.y + vec3(0.0, i1.y, 1.0 ))
//    + i.x + vec3(0.0, i1.x, 1.0 ));
//
//  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
//  m = m*m ;
//  m = m*m ;
//
//// Gradients: 41 points uniformly over a line, mapped onto a diamond.
//// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)
//
//  vec3 x = 2.0 * fract(p * C.www) - 1.0;
//  vec3 h = abs(x) - 0.5;
//  vec3 ox = floor(x + 0.5);
//  vec3 a0 = x - ox;
//
//// Normalise gradients implicitly by scaling m
//// Approximation of: m *= inversesqrt( a0*a0 + h*h );
//  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
//
//// Compute final noise value at P
//  vec3 g;
//  g.x  = a0.x  * x0.x  + h.x  * x0.y;
//  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
//  return 130.0 * dot(m, g);
//}
