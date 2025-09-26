"use client";

import { Icon } from "@iconify/react";
import clx from "clsx";
import React, { useState } from "react";
// import { ServiceModal, ServiceOwnerModal } from "./modals";
import { Service } from "@/lib/services/registry/types";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

type ServiceListCardProps = Readonly<{
    serviceName: string;
    description: string;
    totalHours: number;
    costPerHour: number;
    isActive?: boolean;
    // For selection mode
    onSelect?: () => void;
    isSelected?: boolean;
    // For list mode
    onDelete?: () => void;
}>;

export function ServiceListCard(props: ServiceListCardProps) {
    return (
        <div onClick={props.onSelect} className={clx(
            "flex flex-col p-6 rounded-lg shadow-md transition-all duration-300 border",
            props.onSelect && "cursor-pointer",
            props.isSelected
                ? 'bg-primary-50 border-primary-500 ring-2 ring-primary-500 shadow-lg'
                : 'bg-white hover:shadow-lg'
        )}>
            <div className="flex flex-row items-start justify-between mb-3">
                <h3 className="text-title-desktop-small text-neutral-900 font-semibold flex-1 mr-3">
                    {props.serviceName}
                </h3>
                {props.onSelect ? (
                    <Icon
                        icon={props.isSelected ? "material-symbols:check-circle-rounded" : "material-symbols:add-circle-outline"}
                        className={clx("h-6 w-6 flex-shrink-0 transition-colors",
                            props.isSelected ? "text-primary-600" : "text-neutral-400"
                        )}
                    />
                ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${props.isActive
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                        }`}>
                        {props.isActive ? 'Active' : 'Inactive'}
                    </span>
                )}
            </div>
            
            <p className="text-body-desktop-small text-neutral-600 mb-4">{props.description}</p>
            
            <div className="flex flex-row items-center justify-between gap-4 text-label-desktop-small">
                <div className="flex items-center gap-1 text-neutral-700">
                    <Icon icon="material-symbols-light:schedule-outline" className="h-5 w-5" />
                    <span className="font-medium">{props.totalHours}</span>
                    <span className="text-neutral-500">hrs</span>
                </div>
                
                <div className="flex items-center gap-1 text-neutral-700">
                    {/* <Icon icon="material-symbols-light:money-outline-rounded" className="h-5 w-5" /> */}
                    <span className="font-medium">${props.costPerHour.toFixed(2)}</span>
                    <span className="text-neutral-500">/hr</span>
                </div>
                
                <div className="flex items-center gap-2">
                    <span className='text-primary-600 font-semibold text-base'>
                        ${(props.totalHours * props.costPerHour).toFixed(2)}
                    </span>
                    
                    {props.onDelete && (
                        <button 
                            onClick={props.onDelete} 
                            className="ml-2 p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                            title="Delete service"
                        >
                            <Icon icon="material-symbols-light:delete-outline" className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export function DashboardCard(props: {
    title: string;
    description: string;
    onClick?: () => void;
}) {
    // This is a card component for the dashboard
    return (
        <div className="flex flex-col items-start justify-center gap-2 p-6 bg-white hover:bg-white rounded-2xl shadow-md transition-colors cursor-pointer min-w-48 w-full" onClick={props.onClick}>
            {/* <Icon icon={props.icon} className="h-24 w-24 text-primary-500 mb-md" /> */}
            <h2 className="text-label-desktop text-neutral-600">{props.title}</h2>
            <p className="text-headline-desktop-small text-neutral-900 text-center">{props.description}</p>
        </div>
    )

}