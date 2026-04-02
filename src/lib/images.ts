import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const IMAGE_EXT_PATTERN = /\.(jpg|jpeg|png|webp)$/i;

const stripLeadingSlash = (src: string) => src.replace(/^\/+/, '');

const resolvePublicPath = (src: string) => path.join(PUBLIC_DIR, stripLeadingSlash(src));

const buildVariantSrc = (src: string, width: number, ext: string) => {
	const parsed = path.posix.parse(src);
	if (!parsed.dir || !parsed.name) return src;
	const file = `${parsed.name}-${width}.${ext}`;
	return path.posix.join(parsed.dir, file);
};

const buildSrcset = (src: string, widths: number[], ext: string) => {
	const candidates = widths
		.map((width) => ({ width, src: buildVariantSrc(src, width, ext) }))
		.filter(({ src }) => fs.existsSync(resolvePublicPath(src)))
		.map(({ width, src }) => `${src} ${width}w`);
	return candidates.join(', ');
};

export const buildResponsiveSources = (src: string, widths: number[]) => {
	if (!src || !IMAGE_EXT_PATTERN.test(src)) {
		return { src, jpgSrcset: '', webpSrcset: '' };
	}
	const jpgSrcset = buildSrcset(src, widths, 'jpg');
	const webpSrcset = buildSrcset(src, widths, 'webp');
	return { src, jpgSrcset, webpSrcset };
};
