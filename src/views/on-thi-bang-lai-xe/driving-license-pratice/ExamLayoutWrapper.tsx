'use client'
import React, { useState } from 'react'

import Breadcrumbs from '@mui/material/Breadcrumbs'
import { Box, Button, Collapse, List, ListItem, ListItemButton, ListItemText, useMediaQuery, useTheme } from '@mui/material'
import { styled } from '@mui/material/styles'

import AppLoading from '@/@core/components/AppLoading'
import styles from './styles.module.css'

const StyledBreadcrumbs = styled(Breadcrumbs)(({ }) => ({
    '& .MuiBreadcrumbs-ol': {
        flexWrap: 'nowrap',
        overflow: 'hidden'
    },
    '& .MuiBreadcrumbs-li': {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    }
}))

const ExamLayoutWrapper = ({
    isLoading,
    children,
    breadcrumbs = [],
    onBreadcrumbClick
}: {
    isLoading: boolean
    children: React.ReactNode
    breadcrumbs?: { label: string; href?: string }[]
    onBreadcrumbClick?: (slugArr: string[]) => void
}) => {
    const [expanded, setExpanded] = useState(false)
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down('md'))

    const handleExpandClick = () => {
        setExpanded(!expanded)
    }

    const handleBreadcrumbItemClick = (item: { label: string; href?: string }) => {
        if (!item.href) return
        const queryString = item.href.split('?')[1] || ''
        const params = new URLSearchParams(queryString)

        const slugArr = [
            params.get('parentSlug'),
            params.get('childSlug'),
            params.get('examSlug'),
            params.get('examname')
        ].filter(Boolean) as string[]

        onBreadcrumbClick?.(slugArr)
    }

    return (
        <div className={styles.body}>
            <div className={styles.content}>
                {breadcrumbs.length > 0 && (
                    <div style={{ background: '#f7f7f7', padding: '12px 20px', fontSize: 14, color: '#888', width: '100%', margin: '0 auto', borderRadius: '2px' }}>
                        {isMobile ? (
                            <Box>
                                <StyledBreadcrumbs aria-label="breadcrumb" maxItems={2} itemsAfterCollapse={1}>
                                    {breadcrumbs.slice(0, 1).map((item, idx) =>
                                        item.href ? (
                                            <span
                                                key={`${item.href}-${idx}`}
                                                style={{ color: '#888', textDecoration: 'none', cursor: 'pointer' }}
                                                onClick={() => handleBreadcrumbItemClick(item)}
                                            >
                                                {item.label}
                                            </span>
                                        ) : (
                                            <span key={`${item.href}-${idx}`} style={{ color: '#222', fontWeight: 500 }}>{item.label}</span>
                                        )
                                    )}
                                    {breadcrumbs.length > 2 && (
                                        <Button
                                            size="small"
                                            onClick={handleExpandClick}
                                            sx={{
                                                minWidth: 'auto',
                                                p: 0.5,
                                                color: '#888',
                                                '&:hover': { color: '#222' }
                                            }}
                                        >
                                            ...
                                        </Button>
                                    )}
                                    {breadcrumbs?.length > 2 && breadcrumbs.slice(-1).map((item, idx) =>
                                        item.href ? (
                                            <span
                                                key={`${item.href}-${idx}`}
                                                style={{ color: '#888', textDecoration: 'none', cursor: 'pointer' }}
                                                onClick={() => handleBreadcrumbItemClick(item)}
                                            >
                                                {item.label}
                                            </span>
                                        ) : (
                                            <span key={`${item.href}-${idx}`} style={{ color: '#222', fontWeight: 500 }}>{item.label}</span>
                                        )
                                    )}
                                </StyledBreadcrumbs>
                                <Collapse in={expanded} timeout="auto" unmountOnExit>
                                    <List dense sx={{ bgcolor: 'background.paper', mt: 1, borderRadius: 1 }}>
                                        {breadcrumbs.slice(1, -1).map((item, idx) => (
                                            <ListItem key={`${item.href}-${idx}`} disablePadding>
                                                <ListItemButton
                                                    onClick={() => {
                                                        handleBreadcrumbItemClick(item)
                                                        setExpanded(false)
                                                    }}
                                                    sx={{ py: 0.5 }}
                                                >
                                                    <ListItemText
                                                        primary={item.label}
                                                        primaryTypographyProps={{
                                                            fontSize: 14,
                                                            color: '#888'
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Collapse>
                            </Box>
                        ) : (
                            <StyledBreadcrumbs aria-label="breadcrumb">
                                {breadcrumbs.map((item, idx) =>
                                    item.href ? (
                                        <span
                                            key={`${item.href}-${idx}`}
                                            style={{ color: '#888', textDecoration: 'none', cursor: 'pointer' }}
                                            onClick={() => handleBreadcrumbItemClick(item)}
                                        >
                                            {item.label}
                                        </span>
                                    ) : (
                                        <span key={`${item.href}-${idx}`} style={{ color: '#222', fontWeight: 500 }}>{item.label}</span>
                                    )
                                )}
                            </StyledBreadcrumbs>
                        )}
                    </div>
                )}
            </div>
            {isLoading && <AppLoading />}
            {children}
        </div>
    )
}

export default ExamLayoutWrapper
