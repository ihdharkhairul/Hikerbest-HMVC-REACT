export function HbBadge({ value }: { value: string }) {
    const slug = value.toLowerCase().replace(/\s+/g, '-');

    return <span className={`hb-badge hb-badge-${slug}`}>{value}</span>;
}