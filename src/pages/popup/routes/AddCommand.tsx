import React, { FC, useCallback, useState, useEffect } from 'react'
import { useParams } from "react-router-dom";
import { tabsService } from "../services";
import { ElementData } from '../../../common'

export const AddCommand: FC = () => {
  const { hostname } = useParams();
  const [actionElement, setActionElement] = useState<undefined | ElementData>(undefined);

  const interceptElement = useCallback(async () => {
    const response = await tabsService.runInterceptElement();

    if (response === 'ok') {
      console.log('Intercept', response);
      window.close();
    }
  }, []);

  const removeInterceptedElement = useCallback(async () => {
    await chrome.storage.sync.remove('__test_intercept_element');
  }, []);

  useEffect(() => {
    const loadInterceptElement = async () => {
      const d = await chrome.storage.sync.get('__test_intercept_element');
      setActionElement(d.__test_intercept_element)
    }
    
    loadInterceptElement();
  }, [])

  return (
    <>
      <h3>Add Command to {hostname}</h3>
      <h3>innerText {actionElement?.innerText}</h3>
      <h3>tagName {actionElement?.tagName}</h3>
      <button onClick={interceptElement}>Intercept Element</button>
      <button onClick={removeInterceptedElement}>Remove Intercept Element</button>
    </>
  )
}
