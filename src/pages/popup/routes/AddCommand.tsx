import React, { FC, useCallback, useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { tabsService } from "../services";
import { Action } from '../../../common'

export const AddCommand: FC = () => {
  const { hostname } = useParams();
  const [action, setAction] = useState<undefined | Action>(undefined);

  const interceptElement = useCallback(async () => {
    const response = await tabsService.runInterceptElement();

    if (response === 'ok') {
      console.log('Intercept', response);
      window.close();
    }
  }, []);

  useEffect(() => {
    const loadInterceptElement = async () => {
      const d = await chrome.storage.sync.get('__test_intercept_element');
      setAction(d.__test_intercept_element)
    }
    
    loadInterceptElement();
  }, [])

  return (
    <>
      <h3>Add Command to {hostname}</h3>
      <h3>elementInnerText {action?.elementInnerText}</h3>
      <h3>elementTagName {action?.elementTagName}</h3>
      <button onClick={interceptElement}>Intercept Element</button>
    </>
  )
}
