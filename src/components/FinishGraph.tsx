import { Area, CartesianGrid, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const CustomTooltip = ({active, payload}: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload;

        return (
            <div className="bg-black/50 px-2 py-1 rounded">
                <div className="flex flex-row justify-between space-x-1">
                    <p className="word !text-sm">
                        {data.word}
                    </p>
                    { data.word !== data.typed &&
                    <p className="incorrect-word !text-sm line-through">
                        {data.typed}
                    </p>
                    }
                </div>
                <div className="flex">
                    <p className="word !text-sm !text-[#F79F79]">
                        WPM:&nbsp;
                    </p>
                    <p className="word !text-sm">
                        {data.wpm}
                    </p>
                </div>
                <div className="flex">
                    <p className="word !text-sm !text-[#9c7445]">
                        Raw WPM:&nbsp;
                    </p>
                    <p className="word !text-sm">
                        {data.rawWpm}
                    </p>
                </div>
            </div>
        )
    }
}

export default function FinishGraph({timestamps, words, typedWords}: {
    timestamps: Date[],
    words: string[],
    typedWords: string[],
}) {
    const times = timestamps.map(
        timestamp => timestamp.getTime()
    )
    
    const data = [];
    let wrongCharacters = 0;

    for (let i = 0; i < words.length; i++) {

        if (words[i] !== typedWords[i]) {
            if (i === words.length) {
                wrongCharacters += words[i].length
            } else {
                wrongCharacters += words[i].length + 1
            }
        }

        const accumulativeCharacters = words.slice(0,i+1).toString().length
        const secondsSinceStart = (times[i+1] - times[0]) / 1000 / 60
        const STANDARD_WORD_LENGTH = 5 

        const wpm = Math.max(0, Math.round((accumulativeCharacters - wrongCharacters) / secondsSinceStart / STANDARD_WORD_LENGTH * 100) / 100)
        const rawWpm = Math.max(0, Math.round(accumulativeCharacters / secondsSinceStart / STANDARD_WORD_LENGTH * 100) / 100)

        data.push({word: words[i], typed: typedWords[i], rawWpm: rawWpm, wpm: wpm });

    }

    return (
        <ResponsiveContainer width='100%' height={400}>
            <ComposedChart data={data}>
                <defs>
                    <linearGradient id='colorWpm' x1='0' y1='0' x2='0' y2='1'>
                        <stop offset="5%" stopColor="#F79F79" stopOpacity={0.8}/>
                        <stop offset="100%" stopColor="#F79F79" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                

                <Area type="monotone" dataKey="wpm" name="WPM" dot={false} strokeWidth={4} stroke="#F79F79" fill='url(#colorWpm)' />
                <Line type="monotone" dataKey="rawWpm" name="Raw WPM" dot={false} strokeWidth={3} stroke="#9c7445" strokeDasharray='16 10' />
                <XAxis className="word !text-base" tickSize={2} interval={1} tickFormatter={(value, _) => (value+1)} label={{value: 'Word', position: 'insideBottom', style: {textAnchor: 'middle'}}}/>
                <YAxis className="word !text-base" tickSize={2} label={{value: 'WPM', angle: -90, position: 'insideLeft', style: {textAnchor: 'middle'}}} domain={['auto']} />
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="top" align="right" layout="centric" />
                <CartesianGrid opacity={0.08} vertical={false} strokeDasharray='1 1' />
                
            </ComposedChart>
        </ResponsiveContainer>
    )
}