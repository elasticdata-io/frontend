export class StringColorUtil {
	static _hashCode(str) {
		let hash = 0;
		for (let i = 0; i < str.length; i++) {
			hash = str.charCodeAt(i) + ((hash << 5) - hash);
		}
		return hash;
	}

	static _intToRGB(i) {
		const c = (i & 0x00ffffff).toString(16).toUpperCase();

		return '00000'.substring(0, 6 - c.length) + c;
	}

	static toRgb(str) {
		if (!str) {
			return null;
		}
		return StringColorUtil._intToRGB(StringColorUtil._hashCode(str));
	}
}
