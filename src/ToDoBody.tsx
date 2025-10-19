import * as React from 'react';
import { List } from '@fluentui/react/lib/List';
import { ITheme, mergeStyleSets, getFocusStyle } from '@fluentui/react/lib/Styling';
import { useConst } from '@fluentui/react-hooks';
import { useTheme } from '@fluentui/react/lib/Theme';
import { Icon, Stack, TextField } from '@fluentui/react';
import { useNavigate } from 'react-router-dom';
import VerticalSidebar from './VerticalSidebar';
import { supabase } from './supabaseClient';

import { initializeIcons } from '@fluentui/font-icons-mdl2';
initializeIcons();

export interface IExampleItem {
  id: string;
  name: string;
  time: string;
  location: string;
  description: string;
  category?: string;
  found_date?: string;
  item_photo?: { path: string }[];
}

/* HARD CODED ITEM NAME, TIME, DESCRIPTION (commented out now) */
// const createListItems = (): IExampleItem[] => [
//   { name: 'Item 1', time: 'Time 1', location:'ASB', description: 'Description 1' },
//   { name: 'Item 2', time: 'Time 2',  location:'WMC', description: 'Description 2' },
//   { name: 'Item 3', time: 'Time 3', location:'SUB', description: 'Description 3' },
//   { name: 'Item 4', time: 'Time 4', location:'Library', description: 'Description 4' },
//   { name: 'Item 5', time: 'Time 5',  location:'Gym', description: 'Description 5' },
// ];

const generateStyles = (theme: ITheme, isOpen: boolean) => {
  const { palette, fonts, semanticColors } = theme;
  return mergeStyleSets({
    sidebar: {
      width: isOpen ? 250 : 0,
      height: '100vh',
      overflowY: 'auto',
      padding: isOpen ? 10 : 0,
      boxSizing: 'border-box',
      borderRight: `1px solid ${semanticColors.bodyDivider}`,
      backgroundColor: palette.neutralLighter,
      transition: 'width 0.3s, padding 0.3s',
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
      left: isOpen ? 260 : 0,
      zIndex: 1000,
      cursor: 'pointer',
      color: 'white',
      display: 'none',
    },
  });
};

export const ToDoBody: React.FC = () => {
  const navigate = useNavigate();

  const onWarningClick = () => {
    navigate('/report-missing-item');
  };

  /* --- STATE --- */
  const [items, setItems] = React.useState<IExampleItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const [isOpen, setIsOpen] = React.useState(true);
  const [selectedItem, setSelectedItem] = React.useState<IExampleItem | null>(null);

  const theme = useTheme();
  const classNames = React.useMemo(() => generateStyles(theme, isOpen), [theme, isOpen]);

  /* --- HELPER FUNCTION FOR IMAGE URL --- */
const getImageUrl = (path?: string) => {
  if (!path) {
    return './no-image.jpg'; // your fallback local image
  }

  // If path already contains bucket folder, use as-is; else prepend
  const finalPath = path.includes('/') ? path : `items/${path}`;
  return supabase.storage.from('items').getPublicUrl(finalPath).data.publicUrl;
};


  /* --- FETCH FROM SUPABASE --- */
  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('item')
        .select(`
          id,
          title,
          description,
          found_date,
          category,
          desk:desk_id(id,name),
          item_photo(path)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Map to your IExampleItem type
      const mappedItems: IExampleItem[] = (data || []).map((item: any) => ({
        id: item.id,
        name: item.title || '(no title)',
        time: item.found_date || 'Unknown',
        location: item.desk?.name || 'Unknown',
        description: item.description || '',
        category: item.category || undefined,
        found_date: item.found_date || undefined,
        item_photo: item.item_photo || [],
      }));

      setItems(mappedItems);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchItems();
  }, []);

  /* --- RENDER CELL --- */
  const onRenderCell = React.useCallback(
    (item?: IExampleItem, index?: number): JSX.Element | null => {
      if (!item) return null;

      const imgUrl = getImageUrl(item.item_photo?.[0]?.path); // <-- updated

      return (
        <div
          className={classNames.itemCell}
          data-is-focusable={true}
          onClick={() => setSelectedItem(item)}
          style={{ cursor: 'pointer' }}
        >
          <img className={classNames.itemImage} src={imgUrl} alt="Item image" />
          <div className={classNames.itemContent}>
            <div className={classNames.itemName}>{item.name}</div>
            <div className={classNames.itemTime}>{item.time}</div>
            <div className={classNames.itemLocation}>{item.location}</div>
            {/* <div className={classNames.description}>{item.description}</div> */}
          </div>
        </div>
      );
    },
    [classNames]
  );

  /* --- FILTER FUNCTION --- */
  const onFilterChanged = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ): void => {
    if (!newValue) {
      fetchItems(); // fetch fresh from Supabase if cleared
      return;
    }
    const lowerText = newValue.toLowerCase();
    setItems((prev) =>
      prev.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerText) ||
          item.description?.toLowerCase().includes(lowerText) ||
          item.location?.toLowerCase().includes(lowerText)
      )
    );
  };

  const handleIconClick = (location: string) => {
    setItems((prev) =>
      prev.filter((item) => item.location?.toLowerCase().includes(location.toLowerCase()))
    );
  };

  /* --- MAIN RENDER --- */
  return (
    <div style={{ display: 'flex', height: '100vh', border: '2px solid black' }}>
      {loading && <div style={{ position: 'absolute', top: 10, left: 10 }}>Loading...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}

      {/* Example map clicks */}
      <span
        onClick={() => handleIconClick('Library')}
        style={{
          position: 'absolute',
          top: '30%',
          left: '52%',
          width: '10vw',
          height: '4vw',
          backgroundColor: 'transparent',
          cursor: 'pointer',
          display: 'inline-block',
        }}
      ></span>

      {/* Sidebar */}
      <div style={{ position: 'relative', marginLeft: '3.3vw' }}>
        <VerticalSidebar onSearchClick={() => setIsOpen(!isOpen)} onWarningClick={onWarningClick} />
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
          <p>{selectedItem.location}</p>
          <p>{selectedItem.description}</p>
          <img
            className={classNames.itemImage}
            src={getImageUrl(selectedItem.item_photo?.[0]?.path)} // <-- updated
            alt="Item image"
          />
          <button onClick={() => setSelectedItem(null)}> Close</button>
        </div>
      )}
    </div>
  );
};
