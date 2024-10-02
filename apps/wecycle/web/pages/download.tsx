import { LoadingOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';

const DownloadPage = () => {
  useEffect(() => {
    const userAgent = window.navigator.userAgent.toLowerCase();

    if (
      userAgent.includes('mac') ||
      userAgent.includes('iphone') ||
      userAgent.includes('ipad')
    ) {
      window.location.href =
        'https://apps.apple.com/us/app/homezz/id6449425552';
    } else {
      window.location.href =
        'https://play.google.com/store/apps/details?id=com.homezz';
    }
  }, []);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <p>
        <LoadingOutlined style={{ fontSize: 100 }} />{' '}
      </p>
    </div>
  );
};

export default DownloadPage;
