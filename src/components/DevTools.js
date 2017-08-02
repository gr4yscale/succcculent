import React from 'react'
import { createDevTools } from 'redux-devtools'
import LogMonitor from 'redux-devtools-log-monitor'
import DockMonitor from 'redux-devtools-dock-monitor'
import FilterableLogMonitor from 'redux-devtools-filterable-log-monitor'
import ChartMonitor from 'redux-devtools-chart-monitor'

const tooltipOptions = {
    disabled: false,
    offset: {left: 30, top: 10},
    indentationSize: 2,
    style: {
      'background-color': '#000000',
      'opacity': '0.7',
      'border-radius': '5px',
      'padding': '5px'
    }
}

export default createDevTools(
  <DockMonitor toggleVisibilityKey="ctrl-h"
               changePositionKey="ctrl-b"
               changeMonitorKey="ctrl-m"
               defaultPosition="bottom"
               defaultSize={1}
               defaultIsVisible={false}
               fluid={true}

  >
    <ChartMonitor
      transitionDuration={25}
      theme='tomorrow'
      tooltipOptions={tooltipOptions}
    />
    <LogMonitor/>
    <FilterableLogMonitor/>
  </DockMonitor>
)
