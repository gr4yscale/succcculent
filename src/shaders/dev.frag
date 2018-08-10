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
varying vec3 vNormal;

float lambert(vec3 N, vec3 L)
{
  vec3 nrmN = normalize(N);
  vec3 nrmL = normalize(L);
  float result = dot(nrmN, nrmL);
  return max(result, 0.05);
}

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

//  vec3 lpos = vec3(0.0, -100.0, 10.0);
    vec3 ldiffuse = vec3(0.0, 0.0, 1.0); // keeping these low will decrease contrast
//  vec3 ldir = lpos - P.xyz;
    vec3 ldir = vec3(0.0, -0.5, -0.5);
    vec3 l = ldiffuse * lambert(vNormal, ldir);

 gl_FragColor = vec4(l, 1.0);
 // gl_FragColor = vec4(_iridColor.r * l.r, _iridColor.g * l.g, _iridColor.b * l.b, 1.0) * _incidence;
// gl_FragColor = vec4(_iridColor.r, _iridColor.g, _iridColor.b, 1.0) * _incidence;
// gl_FragColor = vec4(l, 0.4);
// gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0);
}
