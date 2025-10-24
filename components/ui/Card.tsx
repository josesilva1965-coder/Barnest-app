
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  titleExtra?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, titleExtra, children, className = '', ...props }) => {
  return (
    <div className={`bg-brand-dark border border-brand-primary rounded-lg shadow-lg p-4 md:p-6 ${className}`} {...props}>
      {(title || titleExtra) && (
        <div className="flex justify-between items-center mb-4">
          {title ? <h3 className="text-lg md:text-xl font-bold text-brand-accent">{title}</h3> : <div />}
          {titleExtra && <div>{titleExtra}</div>}
        </div>
      )}
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
};

export default Card;
