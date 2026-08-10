const BLOBS = [
  { color: '#c7bdff', size: 340, top: '-8%', right: '-14%', delay: '0s' },
  { color: '#ffd79a', size: 260, top: '22%', left: '-18%', delay: '-4s' },
  { color: '#a7f3d8', size: 300, bottom: '-12%', right: '-10%', delay: '-8s' },
  { color: '#ffc2d1', size: 220, bottom: '18%', left: '-12%', delay: '-11s' },
];

export default function BlobBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(160deg,#eef2ff_0%,#f7f0ff_45%,#ecfdfa_100%)]">
      {BLOBS.map((blob, i) => (
        <div
          key={i}
          className="anim-blob absolute rounded-full opacity-55 blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            background: blob.color,
            top: blob.top,
            right: blob.right,
            bottom: blob.bottom,
            left: blob.left,
            animationDelay: blob.delay,
          }}
        />
      ))}
    </div>
  );
}
