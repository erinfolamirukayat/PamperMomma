"use client";


import { Icon } from "@iconify/react";
import clx from "clsx";
import Link from "next/link";
import { useRef, useState } from "react";

export interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    // Additional props can be added here if needed
    labeltext?: string;
}

export interface TextAreaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    // Additional props can be added here if needed
    labeltext?: string;
}

export interface SelectFieldProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    // Additional props can be added here if needed
    labeltext?: string;
    labelclassname?: string;
}

export function InputField(props: InputFieldProps) {
    // This is a reusable input field component
    return (
        <div className="flex flex-col min-w-0">
            <label
                htmlFor={props.id}
                className="text-label-desktop text-neutral-900"
            >{props.labeltext}</label>
            <input autoComplete="off" {...props} className={clx(
                "bg-primary-100 rounded-md p-4 text-body-desktop-small w-full border-2 border-transparent transition-all duration-200 hover:border-primary-300", 
                props.className)} />
        </div>
    )
}

export function TextAreaField(props: TextAreaFieldProps) {
    // This is a reusable text area field component
    return (
        <div className="flex flex-col min-w-0">
            <label
                htmlFor={props.id}
                className="text-label-desktop text-neutral-900"
            >{props.labeltext}</label>
            <textarea {...props} className={clx(
                "bg-primary-100 rounded-md p-4 text-body-desktop-small w-full border-2 border-transparent transition-all duration-200 hover:border-primary-300", 
                props.className)} />
        </div>
    )
}

export function SelectField(props: SelectFieldProps) {
    // This is a reusable select field component
    return (
        <div className="flex flex-col min-w-0">
            <label
                htmlFor={props.id}
                // className="text-label-desktop text-neutral-900"
                className={clx("text-label-desktop text-neutral-900", props.labelclassname)}
            >{props.labeltext}</label>
            <select {...props} className={clx(
                "bg-primary-100 rounded-md p-4 text-body-desktop-small w-full border-2 border-transparent transition-all duration-200 hover:border-primary-300", 
                props.className)}>
                {props.children}
            </select>
        </div>
    )
}

export interface RegistryLinkFieldProps {
    id?: string;
    labeltext?: string;
    sharableId?: string;
}


export function RegistryLinkField(props: RegistryLinkFieldProps) {
    // This is a reusable widget component for registry links
    const field = useRef(null as HTMLDivElement | null);
    const sharablelink = `https://pampermomma.com/my/${props.sharableId}`;
    const copyLinkHandler = async () => {
        await navigator.clipboard.writeText(sharablelink);
        if (field.current) {
            field.current.title = "copied link to clipboard!";
            setTimeout(() => {
                if (field.current) {
                    field.current.title = "copy link";
                }
            }, 5000);
        }
    }
    return (
        <div className="flex flex-col min-w-0 w-full">
            <label
                htmlFor={props.id}
                className="text-label-desktop text-neutral-900 uppercase"
            >{props.labeltext}</label>
            <div className="flex flex-row items-center bg-orange-100 rounded-md p-2 text-body-desktop-small w-full">
                <p className="overflow-hidden text-ellipsis w-full flex-1 whitespace-nowrap" title={sharablelink}>{sharablelink}</p>
                <div ref={field} title="copy link">
                    <Icon icon="material-symbols-light:content-copy" className="h-6 w-6 text-orange-700 cursor-pointer" onClick={copyLinkHandler} />
                </div>
            </div>
            <div className="flex flex-row items-center justify-between mt-3">
                <h4 className="text-label-desktop text-orange-800">Share on →</h4>
                <div className="flex flex-row gap-2">
                    <Link href=""><Icon icon="logos:whatsapp-icon" className="h-6 w-6" /></Link>
                    <Link href=""><Icon icon="logos:facebook" className="h-6 w-6" /></Link>
                    <Link href=""><Icon icon="logos:instagram-icon" className="h-6 w-6" /></Link>
                    <Link href=""><Icon icon="logos:x" className="h-6 w-6" /></Link>
                </div>
            </div>
        </div>
    )
}

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labeltext?: string;
}

export function CheckboxField(props: CheckboxFieldProps) {
    const [isChecked, setIsChecked] = useState(props.checked || props.defaultChecked || false);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
        if (props.onChange) {
            props.onChange(e);
        }
    };

    return (
        <div className='flex items-center gap-2 mt-4'>
            <div className="relative">
                <input 
                    {...props} 
                    type="checkbox" 
                    id={props.id} 
                    className="sr-only"
                    onChange={handleChange}
                />
                <label 
                    htmlFor={props.id} 
                    className={clx(
                        "w-14 h-14 bg-primary-100 rounded-md cursor-pointer border-2 border-transparent transition-all duration-200 flex items-center justify-center",
                        "hover:border-primary-300",
                        isChecked && "bg-primary-500 border-primary-500",
                        props.className
                    )}
                >
                    <Icon 
                        icon="material-symbols:check" 
                        className={clx(
                            "w-7 h-7 text-white transition-opacity duration-200",
                            isChecked ? "opacity-100" : "opacity-0"
                        )} 
                    />
                </label>
            </div>
            <label htmlFor={props.id} className='text-label-desktop-large cursor-pointer'>{props.labeltext}</label>
        </div>
    )
}