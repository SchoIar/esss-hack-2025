import * as React from 'react';
import { TextField } from '@fluentui/react/lib/TextField';
import { List } from '@fluentui/react/lib/List';
import { ITheme, mergeStyleSets, getFocusStyle } from '@fluentui/react/lib/Styling';
import { useConst } from '@fluentui/react-hooks';
import { useTheme } from '@fluentui/react/lib/Theme';

export interface IExampleItem {
    name: string;
    time: string
    location: string,
    description: string;
}

/* HARD CODED ITEM NAME, TIME, DESCRIPTION */
const createListItems = (): IExampleItem[] => [
  { name: 'Item 1', time: 'Time 1', location:'ASB', description: 'Description 1' },
  { name: 'Item 2', time: 'Time 2',  location:'WMC', description: 'Description 2' },
  { name: 'Item 3', time: 'Time 3', location:'SUB', description: 'Description 3' },
  { name: 'Item 4', time: 'Time 4', location:'Library', description: 'Description 4' },
  { name: 'Item 5', time: 'Time 5',  location:'Gym', description: 'Description 5' },
];


const generateStyles = (theme: ITheme, isOpen: boolean) => {
  const { palette, fonts, semanticColors } = theme;
  return mergeStyleSets({
    sidebar: {
      width: isOpen ? 250 : 0, // 0 width if closed
      height: '100vh',
      overflowY: 'auto',
      padding: isOpen ? 10 : 0,
      boxSizing: 'border-box',
      borderRight: `1px solid ${semanticColors.bodyDivider}`,
      backgroundColor: palette.neutralLighter,
      transition: 'width 0.3s, padding 0.3s', // smooth animation
    },
    itemCell: [
      getFocusStyle(theme, { inset: -1 }),
      {
        minHeight: 70,
        padding: 8,
        boxSizing: 'border-box',
        borderBottom: `1px solid ${semanticColors.bodyDivider}`,
        display: 'flex',
        alignItems: 'center',
        selectors: {
          '&:hover': { background: palette.neutralLight },
        },
      },
    ],
    itemImage: {
      flexShrink: 0,
      width: 70,
      height: 70,
      borderRadius: 4,
      objectFit: 'cover' as const,
      marginRight: 10,
    },
    itemContent: {
      overflow: 'hidden',
      flexGrow: 1,
    },
    itemName: [
      fonts.medium,
      {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      },
    ],
    itemTime: {
      fontSize: fonts.small.fontSize,
      color: palette.neutralTertiary,
    },
    itemLocation: {
      fontSize: fonts.small.fontSize,
      color: palette.neutralTertiary,
    },
    description: {
      fontSize: fonts.small.fontSize,
      color: palette.neutralTertiary,
    },
    toggleButton: {
      position: 'absolute',
      top: 10,
      left: isOpen ? 260 : 0, // move button with sidebar
      zIndex: 1000,
      cursor: 'pointer',
    },
  });
};

export const ToDoBody: React.FC = () => {
  const originalItems = useConst(() => createListItems());
  const [items, setItems] = React.useState<IExampleItem[]>(originalItems);
  const [isOpen, setIsOpen] = React.useState(true); // sidebar open/close
  const [selectedItem, setSelectedItem] = React.useState<IExampleItem | null>(null);
  const theme = useTheme();
  const classNames = React.useMemo(() => generateStyles(theme, isOpen), [theme, isOpen]);

  const onRenderCell = React.useCallback(
    (item?: IExampleItem, index?: number): JSX.Element | null => {
      if (!item) return null;
      return (
        <div
          className={classNames.itemCell}
          data-is-focusable={true}
          onClick={() => setSelectedItem(item)}
          style={{ cursor: 'pointer' }}
        >
          <img
            className={classNames.itemImage}
            src="https://res.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-react-assets/fluent-placeholder.svg"
            alt="Item image"
          />
          <div className={classNames.itemContent}>
            <div className={classNames.itemName}>{item.name}</div>
            <div className={classNames.itemTime}>{item.time}</div>
            <div className={classNames.itemLocation}>{item.location}</div>
            {/*<div className={classNames.description}>{item.description}</div>*/}
          </div>
        </div>
      );
    },
    [classNames]
  );

  //Filter by keyword
  const onFilterChanged = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string): void => {
    if (!newValue) {
      setItems(originalItems);
      return;
    }
    const lowerText = newValue.toLowerCase();
    setItems(
      originalItems.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerText) ||
          item.description.toLowerCase().includes(lowerText)||
          item.location.toLowerCase().includes(lowerText)
      )
    );
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ position: 'relative' }}>
        <div className={classNames.toggleButton} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '⏴' : '⏵'}
        </div>
        {isOpen && (
          <div className={classNames.sidebar}>
            <TextField label="Filter by Keyword" onChange={onFilterChanged} />
            <List items={items} onRenderCell={onRenderCell} />
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedItem && (
        <div
          style={{
            width: 300,
            padding: 10,
            borderLeft: `1px solid ${theme.semanticColors.bodyDivider}`,
            backgroundColor: theme.palette.neutralLighterAlt,
          }}
        >
          <h3>{selectedItem.name}</h3>
          <p>{selectedItem.time}</p>
          <p >{selectedItem.location}</p>
          <p >{selectedItem.description}</p>
          <img
            className={classNames.itemImage}
            src="https://res.cdn.office.net/files/fabric-cdn-prod_20230815.002/office-ui-fabric-react-assets/fluent-placeholder.svg"
            alt="Item image"
          />
          <button onClick={() => setSelectedItem(null)}> Close</button>
        </div>
      )}
    </div>
  );
};
