import Link from "next/link";
import type { ArticleBlock, ArticleSpan } from "@/lib/corporate/site";

/** Render satu potongan teks: tebal / miring / tautan aktif (internal/eksternal). */
function Span({ span, keyIndex }: { span: ArticleSpan; keyIndex: number }) {
  let node: React.ReactNode = span.text;
  if (span.bold) node = <strong className="font-semibold text-brand-ink">{node}</strong>;
  if (span.italic) node = <em>{node}</em>;

  if (span.href) {
    const external = /^https?:\/\//.test(span.href);
    const cls =
      "font-semibold text-brand-green underline decoration-brand-green/40 underline-offset-2 transition-colors hover:text-brand-green-dark hover:decoration-brand-green";
    return external ? (
      <a key={keyIndex} href={span.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {node}
      </a>
    ) : (
      <Link key={keyIndex} href={span.href} className={cls}>
        {node}
      </Link>
    );
  }
  return <span key={keyIndex}>{node}</span>;
}

function spans(list: ArticleSpan[]) {
  return list.map((s, i) => <Span key={i} span={s} keyIndex={i} />);
}

/** Isi artikel internal berformat: heading, paragraf, daftar (bernomor/tidak). */
export function ArticleBody({ blocks }: { blocks: ArticleBlock[] }) {
  return (
    <div className="mt-8 space-y-6 text-[15.5px] leading-[1.85] text-brand-ink/85">
      {blocks.map((block, i) => {
        if (block.type === "heading") {
          return (
            <h2
              key={i}
              className="pt-2 font-display text-[1.4rem] font-semibold leading-snug tracking-[-0.01em] text-brand-green-dark sm:text-[1.7rem]"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "list") {
          const cls =
            "ml-1 space-y-2.5 pl-5 marker:font-semibold marker:text-brand-gold " +
            (block.ordered ? "list-decimal" : "list-disc marker:text-brand-green");
          return block.ordered ? (
            <ol key={i} className={cls}>
              {block.items.map((item, j) => (
                <li key={j} className="pl-1">
                  {spans(item)}
                </li>
              ))}
            </ol>
          ) : (
            <ul key={i} className={cls}>
              {block.items.map((item, j) => (
                <li key={j} className="pl-1">
                  {spans(item)}
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="text-justify">
            {spans(block.spans)}
          </p>
        );
      })}
    </div>
  );
}
