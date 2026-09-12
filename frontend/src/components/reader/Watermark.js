/**
 * Canvas Watermark Burner
 * 
 * Fuses the reader's identification (Email, Device Token Hash, and Timestamp)
 * directly into the Canvas 2D bitmap context. This ensures that any screenshot
 * or rasterized frame retains proof of origin and cannot be scrubbed via CSS or DOM deletion.
 */

export function burnWatermark(ctx, width, height, watermarkInfo) {
  if (!ctx || !watermarkInfo) return;

  const { email = 'reader@kal-ontha.com', deviceToken = '', timestamp = '' } = watermarkInfo;
  const shortDevice = deviceToken ? deviceToken.substring(0, 10) : 'DEV_OK';
  const timeStr = timestamp || new Date().toLocaleTimeString('ar-EG');
  const mainText = `${email}  •  ${shortDevice}  •  ${timeStr}`;

  ctx.save();

  // 1. Draw subtle diagonal repeated pattern across the page
  ctx.rotate((-25 * Math.PI) / 180);
  ctx.font = '600 13px "Cairo", sans-serif';
  ctx.fillStyle = 'rgba(160, 140, 110, 0.16)';
  ctx.textAlign = 'center';

  const stepX = 260;
  const stepY = 160;
  const startX = -width;
  const endX = width * 2;
  const startY = -height;
  const endY = height * 2;

  for (let x = startX; x < endX; x += stepX) {
    for (let y = startY; y < endY; y += stepY) {
      ctx.fillText(mainText, x, y);
    }
  }

  ctx.restore();

  // 2. Draw discrete corner security stamp in bottom corner
  ctx.save();
  ctx.font = '500 11px "Cairo", sans-serif';
  ctx.fillStyle = 'rgba(120, 100, 80, 0.35)';
  ctx.textAlign = 'left';
  ctx.fillText(`نسخة مرخصة للقارئ: ${email}`, 28, height - 20);
  ctx.restore();
}

export default burnWatermark;
