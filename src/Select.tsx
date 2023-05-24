import { useEffect, useRef, useState } from "react"
import styles from "./Select.module.css"

export type SelectOption = {
    label: string,
    value: string | number
}

type SingleSelectProps = {
    isMulti?: false,
    value?: SelectOption,
    onChange: (value: SelectOption | undefined) => void
}

type MultiSelectProps = {
    value: SelectOption[],
    isMulti: true,
    onChange: (value: SelectOption[]) => void
}

type SelectProps = {
    options: SelectOption[]
} & (SingleSelectProps | MultiSelectProps)

export function Select({ value, onChange, options, isMulti }: SelectProps) {
    const [show, setShow] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)

    const containerRef = useRef<HTMLDivElement>(null)
    const optionsRef = useRef<HTMLLIElement[]>([])

    const clear = () => {
        isMulti ? onChange([]) : onChange(undefined)
    }

    const selectOption = (option: SelectOption) => {
        if (isMulti) {
            if (!value.includes(option)) {
                onChange([...value, option])
            } else {
                onChange(value.filter(o => o !== option))
            }
        } else {
            if (option !== value)
                onChange(option)
        }
    }

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.target != containerRef.current) return
            switch (e.code) {
                case 'Enter':
                case 'Space':
                    setShow(prev => !prev)
                    if (show) selectOption(options[highlightedIndex])
                    break;
                case 'ArrowUp':
                case 'ArrowDown': {
                    if (!show) {
                        setShow(true)
                        break
                    }

                    const newValue = highlightedIndex + (e.code === 'ArrowUp' ? -1 : 1)

                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                        optionsRef.current[newValue].scrollIntoView({ block: 'nearest' })
                    }
                    containerRef.current?.scrollIntoView({ block: 'nearest' })
                    break
                }
                case 'Escape':
                    setShow(false)
                    break
            }
        }

        containerRef.current?.addEventListener('keydown', handler)

        return () => { containerRef.current?.removeEventListener('keydown', handler) }
    }, [highlightedIndex, show, options])

    useEffect(() => {
        optionsRef.current = optionsRef.current.slice(0, options.length);
    }, [options]);

    return (
        <div
            ref={containerRef}
            onClick={() => setShow(prev => !prev)}
            onBlur={() => setShow(false)}
            tabIndex={0}
            className={styles.container}
        >
            <span className={styles.value}>
                {isMulti ? value.map(o => (
                    <button
                        key={o.value}
                        onClick={(e) => {
                            e.stopPropagation()
                            selectOption(o)
                        }}
                        className={`${styles['option-badge']}`}
                        type="button"
                    >
                        {o.label}
                        <span className={`${styles['remove-btn']}`}>&times;</span>
                    </button>))
                    :
                    value?.label
                }
            </span>
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    clear()
                }}
                className={styles["clear-btn"]}
                type="button"
            >
                &times;
            </button>
            <div className={styles.divider} />
            <div className={styles.caret} />
            <ul className={`${styles.optionsList} ${show && styles.show}`}>
                {options.map((o, i) => {
                    const isSelected = isMulti ? value.includes(o) : value === o
                    return (
                        <li
                            ref={el => { if (el) optionsRef.current[i] = el }}
                            key={o.value}
                            onMouseEnter={() => setHighlightedIndex(i)}
                            onClick={() => {
                                selectOption(o)
                            }}
                            className={`
                            ${styles.option}
                             ${isSelected && styles.selected}
                             ${i === highlightedIndex && styles.highlighted}
                             `}
                        >
                            {o.label}
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}