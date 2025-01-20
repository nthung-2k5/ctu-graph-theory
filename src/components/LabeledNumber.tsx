export default function LabeledNumber({ label, value }: { label: string; value: number; })
{
    return (
        <div className='text-center'>
            <strong>{label}</strong>
            <strong className='border border-border w-16 py-0.5 block'>{value}</strong>
        </div>
    );
}