'use client'

import {createContext, useContext, useState, ReactNode} from 'react';

export type BreadcrumbItemType = {
    label: string;
    href?: string;
};

type LayoutContextType = {
    breadcrumbItems: BreadcrumbItemType[];
    setBreadcrumbItems: (items: BreadcrumbItemType[]) => void;
    rightSection?: ReactNode;
    setRightSection: (node: ReactNode) => void;
};

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) throw new Error('useLayout must be used within LayoutProvider');
    return context;
};

export const LayoutProvider = ({children}: {children: ReactNode}) => {
    const [breadcrumbItems, setBreadcrumbItems] = useState<BreadcrumbItemType[]>([]);
    const [rightSection, setRightSection] = useState<ReactNode>();

    return (
        <LayoutContext.Provider value={{breadcrumbItems, setBreadcrumbItems, rightSection, setRightSection}}>
            {children}
        </LayoutContext.Provider>
    );
};
