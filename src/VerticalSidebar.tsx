import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stack, Icon } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react';
import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

const useStyles = mergeStyleSets({
    sidebar: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: 60,
        height: '100vh',
        backgroundColor: '#f3f2f1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 20,
        borderRight: '1px solid #ccc',
        zIndex: 100,
  },
  icon: {
    fontSize: 24,
    color: '#605e5c',
    cursor: 'pointer',
    selectors: {
      ':hover': {
        color: '#0078d4',
      },
    },
  },
});


interface VerticalSidebarProps {
  onSearchClick: () => void;
  onWarningClick: () => void;
}
const VerticalSidebar: FC<VerticalSidebarProps> = ({ onSearchClick, onWarningClick }) => {
    
 
const classNames = useStyles;

  return (
    <div className={classNames.sidebar}>
      {/* Top Icon */}
      <Icon
        iconName="Search"
        className={classNames.icon}
        title="Search"
        onClick={onSearchClick}
        style={{marginBottom: '20px'}}
      />

      {/* Bottom Icon */}
      <Icon
        iconName="Warning"
        className={classNames.icon}
        title="Warning"
        onClick={onWarningClick}
      />
    </div>
  );
};

export default VerticalSidebar;
