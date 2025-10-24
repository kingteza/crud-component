/* *****************************************************************************
 Copyright (c) 2020-2024 Kingteza and/or its affiliates. All rights reserved.
 KINGTEZA PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
***************************************************************************** */

import React, { useState, useEffect, useRef } from "react";
import "./style.css";
import { ButtonComponent } from "../button";

export interface ShowMoreProps {
  anchorClass?: string;
  children?: React.ReactNode;
  className?: string;
  expanded?: boolean;
  keepNewLines?: boolean;
  less?: React.ReactNode;
  lines?: number;
  more?: React.ReactNode;
  onClick?: ((expanded: boolean) => void);
  width?: number;
  truncatedEndingComponent?: React.ReactNode;
}

export const ShowMore: React.FC<ShowMoreProps> = ({
  children,
  className = "",
  expanded = false,
  keepNewLines = false,
  less = "Show less",
  lines = 3,
  more = "Show more",
  onClick,
  width,
  truncatedEndingComponent,
  anchorClass = "show-more-less-clickable"
}) => {
  const [isExpanded, setIsExpanded] = useState(expanded);
  const [showToggle, setShowToggle] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simple overflow check
  const checkOverflow = () => {
    if (!containerRef.current) return;
    
    const element = containerRef.current;
    const lineHeight = Number.parseInt(getComputedStyle(element).lineHeight) || 20;
    const maxHeight = lineHeight * lines;
    
    // Check if content height exceeds the line limit
    const isOverflowing = element.scrollHeight > maxHeight;
    setShowToggle(isOverflowing);
  };

  useEffect(() => {
    // Check overflow after content is rendered
    const timer = setTimeout(checkOverflow, 0);
    return () => clearTimeout(timer);
  }, [children, lines]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => checkOverflow();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleToggle = () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    onClick?.(newExpanded);
  };

  const getTextStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: width ? `${width}px` : '100%',
      wordBreak: 'break-word',
      whiteSpace: keepNewLines ? 'pre-wrap' : 'normal',
    };

    if (!isExpanded && showToggle) {
      return {
        ...baseStyle,
        display: '-webkit-box',
        WebkitLineClamp: lines,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      };
    }

    return baseStyle;
  };

  return (
    <div 
      className={`show-more-container ${className}`} 
      style={{ width: width ? `${width}px` : '100%' }}
    >
      <div ref={containerRef} style={getTextStyle()}>
        {children}
      </div>
      
      {!isExpanded && showToggle && truncatedEndingComponent && (
        <span>{truncatedEndingComponent}</span>
      )}
      
      {showToggle && (
        <button
          type="button"
          className={anchorClass}
          onClick={handleToggle}
          style={{
            cursor: 'pointer',
            background: 'none',
            border: 'none',
            padding: 0,
            font: 'inherit',
            color: 'inherit'
          }}
          aria-label={isExpanded ? 'Show less content' : 'Show more content'}
        >
          {isExpanded ? less : more}
        </button>
      )}
    </div>
  );
};

export default ShowMore;
